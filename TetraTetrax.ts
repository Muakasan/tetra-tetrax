//https://www.nuget.org/packages/jquery.TypeScript.DefinitelyTyped/3.1.0
///<reference path="jquery.d.ts"/>

interface Array<T> {
	includes(value: T): boolean;
}

const N = 25;
const MID = Math.floor(25/2);

type Coord = [number, number];
type Dir = "NORTH"|"SOUTH"|"EAST"|"WEST";
type BMatrix = Array<Array<boolean>>;
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

//Empty Array Initializations
function falseArray(n: Number){
	return Array.apply(null, Array(n)).map(i => false);
}

function emptyMatrix(n: Number){
	return Array.apply(null, Array(n)).map(i => falseArray(n));
}

//Display Matrices
function printMatrix(m: BMatrix){
	console.log();
	for(let r of m){
		console.log(r.join("")
		.replace(/false/g, "_")
		.replace(/true/g, "0"));	
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

//To update display matrix
function updateMatrix(m: BMatrix, f: Array<Coord>, c: Array<Coord>){
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

//Matrix transformations
function translatePoint(point: Coord, x: number, y: number){
    return <Coord>[point[0]+x, point[1]+y];
}

function translateArray(ar: Coord[], x: number, y: number){
    return <Coord[]>ar.map(i => translatePoint(i, x, y));
}

function rotateCounterClockwise(ar: Coord[], p: Coord){
    function rcc(c: Coord){
        let [x, y] = c;
        return <Coord>[-y, x];
    }
    let arTran = translateArray(ar, -p[0], -p[1]);
	let arRot: Coord[] = arTran.map(rcc);
    return translateArray(arRot, p[0], p[1]);
}

function rotateClockwise(ar: Coord[], p: Coord){
    function rc(c: Coord){
        let [x, y] = c;
        return <Coord>[y, -x];
    }
    let arTran = translateArray(ar, -p[0], -p[1]);
    let arRot: Coord[] = arTran.map(rc);
    return translateArray(arRot, p[0], p[1]);
}

//Iteration functions
function getFloor(){
	let floor: Coord[] = [];
	for(let i = 0; i < N; i++){
		floor.push([i, -1]);
	}
	return floor;
}

function getCeiling(){
	let ceil: Coord[] = [];
	for(let i = 0; i < N; i++){
		ceil.push([i, 25]);
	}
	return ceil;	
}

function shiftPoint(x: number, y: number, xA: number, yA: number, block: Coord[]){ //Side-Effects, Leaves old point there, should shift into empty point
	let index: number = block.indexOf([x, y]);
	if(index > -1){
		block.splice(index, 1);
		block.push([x+xA, y+yA]);
	}
}

function shiftShell(d: number, c: Coord[]){ //Side-Effects, Leaves old shell there, should shift into an empty shell
    for(let i = -d +2; i <= d-1; i++){
        shiftPoint(MID+i, MID+4, 0, -1, c);
        shiftPoint(MID+4, MID-i, -1, 0, c);
        shiftPoint(MID-4, MID+i, 1, 0, c);
        shiftPoint(MID-i, MID-4, 0, 1, c);
    }
}

function shellFilled(d: number, c: Coord[]){
    for(let i = -d; i <= d-1; i++){
		if(!(c.includes(<Coord>[MID+i, MID+4]) && 
        	c.includes(<Coord>[MID+4, MID-i]) &&
        	c.includes(<Coord>[MID-4, MID+i]) &&
        	c.includes(<Coord>[MID-i, MID-4]))){
				return false;
		}    
    }
	return true;
}

function isIntersecting(a: Coord[], b: Coord[]){
	for(let aCoord of a){
		for(let bCoord of b){
			if(aCoord[0] == bCoord[0] && aCoord[1] == bCoord[1]){
				return true;
			}
		}
	}
	return false;
}

function hasCollided(upperBlock: Array<Coord>, lowerBlock: Array<Coord>){ //if Upperblock has a point that is directly about a point in lowerblock
	for (let uCoord of upperBlock) {
		for (let lCoord of lowerBlock){
			let [ux, uy] = uCoord;
			let [lx, ly] = lCoord;
			if( (ux-lx) == 0 && uy-ly == 1) return true; 
		}
	}
	return false;	
}

function gameOver(f: Coord[], c: Coord[]){
	return hasCollided(f, getFloor()) || hasCollided(getCeiling(), c); //Maybe make a touching wall instead?
}

function displayEndScreen(sc: number){ 
	$("#game-div").html("Game Over!");
}

function main(){
	let matrix: BMatrix;

	let cBlock: Block = new CBlock([MID, MID],
		[[MID, MID]]);

	let fBlock: Block = new FBlock();

	matrix = emptyMatrix(N);
	updateMatrix(matrix, fBlock.points, cBlock.points);
	renderMatrix(matrix);
	
	let gameRunning = true; //Is this needed?
	
	let score = 0;

	const keyUpAr = 38;
	const keyRightAr = 39;
	const keyDownAr = 40;
	const keyLeftAr = 37;
	const keyQ = 81;
	const keyW = 87;
	const keyE = 69;
	const keyR = 82;
	
	window.addEventListener('keyup', function(e) {
		let key: number = e.keyCode ? e.keyCode : e.which;
		if(gameRunning)
		{
			switch(key){ 
				case keyQ:
					let fCounterClockwise = rotateCounterClockwise(fBlock.points, fBlock.pivot);
					if(!isIntersecting(fCounterClockwise, cBlock.points)){
						fBlock.points = fCounterClockwise;
					}
					break;
				case keyW: 
					let fClockwise = rotateClockwise(fBlock.points, fBlock.pivot); 
					if(!isIntersecting(fClockwise, cBlock.points)){
						fBlock.points = fClockwise;
					}
					break;
				case keyE:
					let cCounterClockwise = rotateCounterClockwise(cBlock.points, cBlock.pivot);
					if(!isIntersecting(cCounterClockwise, fBlock.points)){
						cBlock.points = cCounterClockwise;
					}
					break;
				case keyR:
					let cClocwise = rotateClockwise(cBlock.points, cBlock.pivot);
					if(!isIntersecting(cClocwise, fBlock.points)){
						cBlock.points = cClocwise;
					}
					break;
				case keyRightAr:
					let fTranslateR = translateArray(fBlock.points, 1, 0);
					if(!isIntersecting(fTranslateR, cBlock.points)){
						fBlock.points = fTranslateR;
						fBlock.pivot = translatePoint(fBlock.pivot, 1, 0);
					}
					break;
				case keyLeftAr:
					let fTranslateL = translateArray(fBlock.points, -1, 0);
					if(!isIntersecting(fTranslateL, cBlock.points)){
						fBlock.points = fTranslateL;
						fBlock.pivot = translatePoint(fBlock.pivot, -1, 0);
					}
					break;
				case keyDownAr: //todo make check the floor
					let fTranslateD =  translateArray(fBlock.points, 0, -1);
					//e.preventDefault();
					if(!isIntersecting(fTranslateD, cBlock.points)){
						fBlock.points = fTranslateD;
						fBlock.pivot = translatePoint(fBlock.pivot, 0, -1);   
					}
					break;
			}
			updateMatrix(matrix, fBlock.points, cBlock.points);
			renderMatrix(matrix);
		}
	});
	
	function startIter(){ //Side-Effects
		let timer = setInterval(function(){
			if(gameOver(fBlock.points, cBlock.points)){
				gameRunning = false;
				clearInterval(timer);
				displayEndScreen(score);
			}
			else {
				if(hasCollided(fBlock.points, cBlock.points)){ //Attach to center
					cBlock.points = cBlock.points.concat(fBlock.points)
					fBlock = new FBlock();
					score += 1;
					$("#score").text(score);
				}
				else {
					fBlock.points = translateArray(fBlock.points, 0, -1);
					fBlock.pivot = translatePoint(fBlock.pivot, 0, -1);   
				}
				updateMatrix(matrix, fBlock.points, cBlock.points);
				renderMatrix(matrix);
			}
		}, .5 * 1000);
	}

	startIter();
}

main();