window.onload = function(){
	make_grid();
	make_template();
	make_tetromino();
	runInterval = setInterval(run, speed);
}

const score_points = [50, 150, 300, 600];

const T_tetromino = [
	[[0, 150], [30, 150], [30, 120], [30, 180]], 
	[[0, 120], [30, 120], [60, 120], [30, 150]], 
	[[30, 150], [0, 120], [0, 150], [0, 180]],
	[[0, 150], [30, 150], [60, 150], [30, 120]]
];

const Square_tetromino = [
	[[0, 120], [0, 150], [30, 120], [30, 150]],
	[[0, 120], [0, 150], [30, 120], [30, 150]],
	[[0, 120], [0, 150], [30, 120], [30, 150]],
	[[0, 120], [0, 150], [30, 120], [30, 150]]
];

const Straight_tetromino = [
	[[0, 120], [30, 120], [60, 120], [90, 120]],
	[[0, 90], [0, 120], [0, 150], [0, 180]],
	[[0, 120], [30, 120], [60, 120], [90, 120]],
	[[0, 90], [0, 120], [0, 150], [0, 180]]
];

const L_tetromino = [
	[[0, 120], [30, 120], [60, 120], [0, 150]], //first position
	[[0, 120], [0, 150], [0, 180], [30, 180]], //second position
	[[0, 150], [30, 150], [60, 150], [60, 120]], //third position
	[[0, 120], [30, 120], [30, 150], [30, 180]] //fourth position
];

const Skew_tetromino = [
	[[0, 150], [0, 180], [30, 150], [30, 120]],
	[[0, 120], [60, 150], [30, 150], [30, 120]],
	[[0, 150], [0, 180], [30, 150], [30, 120]],
	[[0, 120], [60, 150], [30, 150], [30, 120]],
];
const tetrominos = [T_tetromino, Square_tetromino, Straight_tetromino, L_tetromino, Skew_tetromino];
const canvas = document.getElementById('canvas');
let tetrominoList = document.getElementsByClassName('square_tetromino');
let number = 0;
let randomTetromino = Math.floor(Math.random() * tetrominos.length);
const colors = ['deeppink', 'yellow', 'deepskyblue', 'darkorange', 'limegreen'];
let randomColor = Math.floor(Math.random() * colors.length); 
let runInterval;
let current_top = 0;
let current_left = 0;
let score = 0;
const rows = 18;
const cols = 10;
const speed = 500;
let grid = [];
let failure = new Audio('failure.mp3');
let scoring = new Audio('scoring.mp3');

function make_template(){
	for(let i = 0; i < rows; i++){
		grid[i] = [];
	}
	for(let i = 0; i < rows; i++){
		for(j = 0; j < cols; j++){
			grid[i][j] = 0;
		}
	}
}

function make_grid(){
	
	for(let i = 0; i < (rows * cols); i++){
		let div = document.createElement('div');
		div.classList.add('square');
		canvas.appendChild(div);
	}	
}

function make_tetromino(){
	tetrominoList = document.getElementsByClassName('square_tetromino');
	randomTetromino = Math.floor(Math.random() * tetrominos.length);
	randomColor = Math.floor(Math.random() * colors.length); 
	current_top = 0;
	current_left = 0;
	let i;
	for(i = 0; i < 4; i++){
		let div = document.createElement('div');
		div.style.backgroundColor = colors[randomColor];
		div.style.top = tetrominos[randomTetromino][number][i][0] + 'px';
		div.style.left = tetrominos[randomTetromino][number][i][1] + 'px';
		div.classList.add('square_tetromino');
		canvas.appendChild(div);
	}
}

document.onkeyup = function(event){
	if(event.keyCode == 38)
		rotate();
	else if(event.keyCode == 39)
		move_right();
	else if(event.keyCode == 37)
		move_left();
	else if(event.keyCode == 40 && !Array.from(tetrominoList).some(e => e.offsetTop == 510) && check_collision_down() == false)
		move_down();
}

function rotate(){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	for(let tetr of tetrominoList)
		tetr.classList.remove('square_tetromino');
	++number;
	if(number == 4)
		number = 0;
	if(check_rotation_right(number) == false || check_rotation_left(number) == false){
		number--;
		if(number == -1)
			number = 3;
	}
	for(i = 0; i < 4; i++){
		let div = document.createElement('div');
		div.style.top = current_top + tetrominos[randomTetromino][number][i][0] + 'px';
		div.style.left = current_left + tetrominos[randomTetromino][number][i][1] + 'px';
		div.style.backgroundColor = colors[randomColor];
		div.classList.add('square_tetromino');
		canvas.appendChild(div);
	}
}

function check_rotation_right(nr){
	let max = Number.MIN_VALUE;
	for(let i = 0; i < 4; i++){
		let cur = current_left + tetrominos[randomTetromino][nr][i][1];
		max = cur > max ? cur : max;
	}
	if(max <= 270)
		return true;
	return false;
}

function check_rotation_left(nr){
	let min = Number.MAX_VALUE;
	for(let i = 0; i < 4; i++){
		let cur = current_left + tetrominos[randomTetromino][nr][i][1];
		min = cur < min ? cur : min;
	}
	if(min >= 0)
		return true;
	return false;
}

function run(){
	let scoreDiv = document.getElementById('score');
	scoreDiv.innerHTML = 'Score: ' + score;
	tetrominoList = document.querySelectorAll('.square_tetromino');
	increase_score();
	if(!Array.from(tetrominoList).some(e => e.offsetTop == 510) && check_collision_down() == false)
		move_down();
	else if(check_collision_top() == true)
		end_game();
	else
		leave_tetromino();
}

function move_down(){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	current_top += 30;
	for(let tetr of tetrominoList)
		tetr.style.top = tetr.offsetTop + 30 + 'px';
}

function leave_tetromino(){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	for(let tetr of tetrominoList){
		grid[tetr.offsetTop / 30][tetr.offsetLeft / 30] = 1;
		tetr.classList.remove('square_tetromino');
		tetr.classList.add('left');
	}
	make_tetromino();
}

function end_game(){
	failure.play();
	let gameOver = document.getElementById('gameOver');
	gameOver.style.visibility = 'visible';
	clearInterval(runInterval);
}

function check_collision_top(){
	let counter = 0;
	m = 0;
	for(n = 0; n < cols; n++){
		if(grid[m][n] == 1)
			return true;
	}
	return false;
}

function check_collision_down(){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	for(let tetr of tetrominoList){
		if(grid[(tetr.offsetTop / 30) + 1][tetr.offsetLeft / 30] == 1)
			return true;
	}
	return false;
}

function check_collision_side(direction){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	for(let tetr of tetrominoList){
		if(grid[(tetr.offsetTop / 30)][tetr.offsetLeft / 30 + direction] == 1)
			return true;
	}
	return false;
}

function move_right(){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	if(!Array.from(tetrominoList).some(e => e.offsetLeft == 270) && !Array.from(tetrominoList).some(e => e.offsetTop == 510) && check_collision_side(1) == false){
		for(let tetr of tetrominoList){
			tetr.style.left = tetr.offsetLeft + 30 + 'px';
			current_left += 7.5;
		}
	}
}

function move_left(){
	tetrominoList = document.querySelectorAll('.square_tetromino');
	if(!Array.from(tetrominoList).some(e => e.offsetLeft == 0) && !Array.from(tetrominoList).some(e => e.offsetTop == 510) && check_collision_side(-1) == false){
		for(let tetr of tetrominoList){
				tetr.style.left = tetr.offsetLeft - 30 + 'px';
				current_left -= 7.5;
		}
	}
}

function increase_score(){
	let counter = 0;
	let line_counter = 0;
	let m;
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			if(grid[i][j] == 1)
				counter++;
		}
		if(counter == cols){
			line_counter++;
			scoring.play();
			m = i;
			drop_tetrominos(m);
		}
		counter = 0;
	}
	if(line_counter > 0)
		score += score_points[line_counter - 1];
}

function drop_tetrominos(m){
	let square2 = document.getElementsByClassName('left');
	Array.from(square2).forEach(element => {
		if(element.offsetTop == m * 30)
			element.classList.remove('left');
		else if(element.offsetTop < m * 30){
			element.style.top = element.offsetTop + 30 + 'px';
		}
	});
	while(m > 0){
		for(let j = 0; j < cols; j++)
			grid[m][j] = grid[m-1][j];
		m--;
	}
	for(let j = 0; j < cols; j++)
		grid[0][j] = 0;
}