var VK = require('vkapi');
var vk = new VK({'mode' : 'oauth'});
var vktoken = require('vk-token-FIXED');
var chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

global.wall = "-62036771";

global.countWall = 0

global.offset = 0

global.isGroup = true

global.token = "33072395dc9220076a83dd7a683ec61ab14d7041aaf4cad77de156acee5035dbbe550a808ce73a89fdebb"
// start
//auth()

function auth(){
	rl.question('Enter VK login: ', (login) => {
		rl.question('Enter VK password: ', (password) => {
			vktoken.getAccessToken(login, password, function(error, token){
				if(token !== 'notoken'){
					console.log(chalk.green('I have a token'));
					global.token = token
					enterGroup(function(){
						console.log(chalk.green('yo! work'));
						start()
					})
				}else{
					console.log(chalk.red("Login or password is incorrected. Try again"));
					return auth()
				}
			})
		})
	});
}

//likePost('1045')
getCount();

function getCount(){
	vk.setToken( { token : global.token });
	vk.request('wall.get', {
	 'owner_id' : global.wall,
	 'count': 1,
	 'v': 5.73
	});
	vk.on('done:wall.get', function(res) {
		console.log(res.response.count);
		global.count = res.response.count
	});
	start()
}

function start(){
	vk.setToken( { token : global.token });
	vk.request('wall.get', {
	 'owner_id' : global.wall,
	 'count': 100,
	 'offset': global.offset,
	 'v': 5.73
	});
	vk.on('done:wall.get', function(res) {
		if(global.count <= 0){
			var index = global.count
			setTimeout(likePost, 3000, res, index);
			console.log(chalk.green('end!!!'));
		}else{
			console.log('vse norm');
			var index = 99
			setTimeout(likePost, 3000, res, index);
			global.countWall = global.countWall - 100
			global.offset = global.offset + 100
		}
	});
}
function likePost(res, index){
	if(index == 0){
		start()
	}else{
		console.log(res.response.items[2]);
		console.log(res.response.items[98]);
		var post_id = res.response.items[index].id
		console.log(post_id);
		vk.setToken( { token : global.token });
		vk.request('likes.add', {
		 'type' : 'post',
		 'owner_id': global.wall,
		 'item_id': post_id,
		 'v': 5.73
		});
		vk.on('done:likes.add', function(res){
			if(res.error !== undefined){
				console.log(chalk.red('captcha...'));
				process.exit();
			}else{
				console.log(res);
				setTimeout(likePost, 3000, res.response.items, index-1);
			}
		})
	}

}

function enterGroup(callback_func){
	rl.question('Enter wall url for like: ', (wall) => {
		global.wall = wall
		function get_id(callback){
			vk.setToken( { token : global.token });
			console.log(global.wall);
			vk.request('groups.getById', {
			 'group_ids' : global.wall,
			 'v': 5.73
			});
			vk.on('done:groups.getById', function(res) {
				if(res.error == undefined){
					console.log(res.response[0].id);
					global.wall = '-'+res.response[0].id
					callback()
				}else{
					vk.request('users.get', {
					 'user_ids' : global.wall,
					 'v': 5.73
					});
					vk.on('done:users.get', function(res) {
						if(res.error == undefined){
							console.log(res.response[0].id);
							global.wall = res.response[0].id
							callback()
						}else{
							global.wall = 'error'
							callback()
						}
					});
				}
			});
		}
		get_id(function(){
				if(global.wall == 'error'){
					console.log(chalk.red('Incorrect id. Try again'));
					enterGroup()
				}else{
					callback_func()
				}
		});
	})
}
