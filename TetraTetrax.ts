//https://raw.githubusercontent.com/clark-stevenson/paper.d.ts/master/paper.d.ts
//https://www.nuget.org/packages/jquery.TypeScript.DefinitelyTyped/3.1.0

///<reference path="paper.d.ts"/>
///<reference path="jquery.d.ts"/>

//pivot should be the first element?

interface Array<T> {
	fill(value: T): Array<T>;
}

type coord = [number, number];
type dir = "NORTH"|"SOUTH"|"EAST"|"WEST";
type bmatrix = Array<Array<boolean>>;

const N = 25;

let matrix: bmatrix;

let fBlock: Array<coord> = [];
let cBlock: Array<coord> = [[0,0]];

function falseArray(n: Number){
	return Array.apply(null, Array(n)).map(i => false);
}

function emptyMatrix(n: Number){
	return Array.apply(null, Array(n)).map(i => falseArray(n));
}

function updateMatrix(m: bmatrix, f: Array<coord>, c: Array<coord>){
	for(let r = 0; r < m.length; r++){
		for(let c = 0; c < m[0].length; c++){
			m[r][c] = false;
		}
	}

	for(let i of f.concat(c)){
		let x = i[0]+(N-1)/2;
		let y = i[1]+(N-1)/2;
		m[x][y] = true;
	}
}

function printMatrix(m: bmatrix){
	console.log();
	for(let r of m){
		console.log(r.join("")
		.replace(/false/g, "_")
		.replace(/true/g, "0"));	
	}
}

function hasCollided(f: Array<coord>, c: Array<coord>){
	for (let fCoord of f) {
		for (let cCoord of c){
			let x1 = fCoord[0];
			let y1 = fCoord[1];
			let x2 = cCoord[0];
			let y2 = cCoord[1];
			if(Math.abs(x1-x2) == 1 && Math.abs(y2-y1) == 0) return true;
			if(Math.abs(x1-x2) == 0 && Math.abs(y2-y1) == 1) return true; 
		}printMatrix(matrix);
	}
	return false;	
}

function checkPerim(d: number, c: Array<coord>){
	for(let i = -d; i <= d; i++){
		if(c.indexOf([-d, i])==-1) return false;
		if(c.indexOf([d, i])==-1) return false;
		if(c.indexOf([i, -d])==-1) return false;
		if(c.indexOf([i, d])==-1) return false;
		//if(cBlock.indexOf([d, i, -1])==-1) return false; //shouldnt this throw a type error?
	}
}

function delPerim(d: number, c: Array<coord>){
	for(let i = -d +2; i < d; i++){
		console.log("Hello");
    }
}

function testDir(d: dir){
	console.log(d);
}

function toDimOne(m: Array<coord>){
	return m.reduce((z, i) => z.concat(i), []);
}

function toDimTwo(a: Array<number>){
	let m: Array<coord> = [];
	for(let i = 0; i < a.length; i+=2){
		m.push([a[i], a[i+1]]);
	}
	return m;
}

function rounded(a: Array<number>){
	return a.map(i => Math.round(i));
}

testDir("EAST");
matrix = emptyMatrix(N);
printMatrix(matrix);
updateMatrix(matrix, fBlock, cBlock);
printMatrix(matrix);

let t = new paper.Matrix(1, 0, 0, 1, 0, 0);
console.log(t.toString());
t.rotate(90, new paper.Point(0, 0));
console.log(t.toString());
let src: Array<number> = [[1, 1]].reduce( (z, i) => z.concat(i), []);
let dst: Array<number> = [];

console.log(t.transform(src, dst, 1));

function onKeyUp(event){
	console.log(event.key)
}

for(let i = 0; i < 25*25; i++)
{
	$("#game-div").append($("<div>", {class: "blue-box", text: i}));
}
