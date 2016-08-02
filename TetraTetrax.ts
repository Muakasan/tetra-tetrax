//https://www.nuget.org/packages/jquery.TypeScript.DefinitelyTyped/3.1.0
///<reference path="jquery.d.ts"/>

interface Array<T> {
	fill(value: T): Array<T>;
}

const N = 25;

type Coord = [number, number];
type dir = "NORTH"|"SOUTH"|"EAST"|"WEST";
type bmatrix = Array<Array<boolean>>;
enum Shape {
    I, O, T, J, L, S, Z
}

interface Block{
    pivot: Coord;
    points: Coord[];
}

class FBlock implements Block{
	pivot: Coord;
	points: Coord[];
    constructor(){
		//7 shapes
    	let s: Shape = Math.floor(Math.random()*7);
        let baseX: number = Math.floor(N/2);
        let baseY: number = N-1;
        switch(s)
        {
            case Shape.I: 
                this.pivot = [baseX+.5, baseY-.5];
                this.points = [
                    [baseX-1, baseY],
                    [baseX, baseY],
                    [baseX+1, baseY],
                    [baseX+2, baseY]
                ];
                break;
            case Shape.O: 
                this.pivot = [baseX-.5, baseY-.5];
                this.points = [
                    [baseX-1, baseY],
                    [baseX, baseY],
                    [baseX-1, baseY-1],
                    [baseX, baseY-1]
                ];
                break;
            case Shape.T: 
                this.pivot = [baseX, baseY-1];
                this.points = [
                    [baseX, baseY],
                    [baseX-1, baseY-1],
                    [baseX, baseY-1],
                    [baseX+1, baseY-1]
                ];
                break;
            case Shape.J: 
                this.pivot = [baseX, baseY-1];
                this.points = [
                    [baseX-1, baseY],
                    [baseX-1, baseY-1],
                    [baseX, baseY-1],
                    [baseX+1, baseY-1]
                ];
                break;
            case Shape.L: 
                this.pivot = [baseX, baseY-1];
                this.points = [
                    [baseX+1, baseY],
                    [baseX-1, baseY-1],
                    [baseX, baseY-1],
                    [baseX+1, baseY-1]
                ];
                break;
            case Shape.S: 
                this.pivot = [baseX, baseY-1];
                this.points = [
                    [baseX, baseY],
                    [baseX+1, baseY],
                    [baseX-1, baseY-1],
                    [baseX, baseY-1]
                ];
                break;
            case Shape.Z:
                this.pivot = [baseX, baseY-1];
                this.points = [
                    [baseX-1, baseY],
                    [baseX, baseY],
                    [baseX, baseY-1],
                    [baseX+1, baseY-1]
                ];
                break;            
        }
		
    }
	
}

class CBlock implements Block {
	pivot: Coord;
	points: Coord[];
    constructor(pivot: Coord, points: Coord[]){
		this.pivot = pivot;
		this.points = points;
	}	
}

function falseArray(n: Number){
	return Array.apply(null, Array(n)).map(i => false);
}

function emptyMatrix(n: Number){
	return Array.apply(null, Array(n)).map(i => falseArray(n));
}

function updateMatrix(m: bmatrix, f: Array<Coord>, c: Array<Coord>){
	for(let r = 0; r < m.length; r++){
		for(let c = 0; c < m[0].length; c++){
			m[r][c] = false;
		}
	}

	for(let i of f.concat(c)){
		let [x, y] = i;
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

function hasCollided(f: Array<Coord>, c: Array<Coord>){
	for (let fCoord of f) {
		for (let cCoord of c){
			let x1 = fCoord[0];
			let y1 = fCoord[1];
			let x2 = cCoord[0];
			let y2 = cCoord[1];
			if(Math.abs(x1-x2) == 1 && Math.abs(y2-y1) == 0) return true;
			if(Math.abs(x1-x2) == 0 && Math.abs(y2-y1) == 1) return true; 
		}
	}
	return false;	
}

function checkPerim(d: number, c: Array<Coord>){
	for(let i = -d; i <= d; i++){
		if(c.indexOf([-d, i])==-1) return false;
		if(c.indexOf([d, i])==-1) return false;
		if(c.indexOf([i, -d])==-1) return false;
		if(c.indexOf([i, d])==-1) return false;
		//if(cBlock.indexOf([d, i, -1])==-1) return false; //shouldnt this throw a type error?
	}
}

function delPerim(d: number, c: Array<Coord>){
	for(let i = -d +2; i < d; i++){
		console.log("Hello");
    }
}

function renderMatrix(matrix){
	$("#game-div").html("")
	for(let i = N-1; i >= 0; i--){
		for(let j = 0; j < N; j++){
			if(matrix[j][i]){
				$("#game-div").append($("<div>", {class: "dark-box"}));
			}
			else {
				$("#game-div").append($("<div>", {class: "light-box"}));
			}
		}
	}
}

function translatePoint(point: Coord, x: number, y: number){
    return <Coord>[point[0]+x, point[1]+y];
}

function translateArray(ar: Coord[], x: number, y: number){
    return <Coord[]>ar.map(i => translatePoint(i, x, y));
}

function rotateCounterClockwise(ar: Coord[], p: Coord){
    function rcc(c: Coord){
        let [x, y] = c;
        return <Coord>[-x, y];
    }
    let arTran = translateArray(ar, -p[0], -p[1]);
    let arRot: Coord[] = ar.map(rcc);
    return translateArray(arRot, p[0], p[1]);
}

function rotateClockwise(ar: Coord[], p: Coord){
    function rc(c: Coord){
        let [x, y] = c;
        return <Coord>[y, -x];
    }
    let arTran = translateArray(ar, -p[0], -p[1]);
    let arRot: Coord[] = ar.map(rc);
    return translateArray(arRot, p[0], p[1]);
}

function main(){
	let matrix: bmatrix;

	let mid = Math.floor(N/2);
	let cBlock: Block = new CBlock([mid, mid],
		[[mid, mid]]);

	let fBlock: Block = new FBlock();

	matrix = emptyMatrix(N);
	updateMatrix(matrix, fBlock.points, cBlock.points);
	renderMatrix(matrix);
	
	window.addEventListener('keyup', function(e) {
		let key: number = e.keyCode ? e.keyCode : e.which;
		let keyUpAr = 38;
		let keyRightAr = 39;
		let keyDownAr = 40;
		let keyLeftAr = 37;
		let keyQ = 81;
		let keyW = 87;
		let keyE = 69;
		let keyR = 82;

		switch(key){
			case keyQ:
				fBlock.points = rotateCounterClockwise(fBlock.points, fBlock.pivot);
				break;
			case keyW: 
				fBlock.points = rotateClockwise(fBlock.points, fBlock.pivot); 
				break;
			case keyRightAr:
				fBlock.points = translateArray(fBlock.points, 1, 0);
				fBlock.pivot = translatePoint(fBlock.pivot, 1, 0);
				break;
			case keyLeftAr:
				console.log(translatePoint(fBlock.pivot, 0, -1));
				console.log(translateArray(fBlock.points, 0, -1));
				fBlock.points = translateArray(fBlock.points, -1, 0);
				fBlock.pivot = translatePoint(fBlock.pivot, -1, 0);
				break;
			case keyDownAr:
				//e.preventDefault();
				fBlock.points = translateArray(fBlock.points, 0, -1);
				fBlock.pivot = translatePoint(fBlock.pivot, 0, -1);   
				break;
		}
		updateMatrix(matrix, fBlock.points, cBlock.points);
		renderMatrix(matrix);
	});
}
main();