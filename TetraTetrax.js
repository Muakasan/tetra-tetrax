//https://www.nuget.org/packages/jquery.TypeScript.DefinitelyTyped/3.1.0
///<reference path="jquery.d.ts"/>
var N = 25;
var MID = Math.floor(25 / 2);
var Shape;
(function (Shape) {
    Shape[Shape["I"] = 0] = "I";
    Shape[Shape["O"] = 1] = "O";
    Shape[Shape["T"] = 2] = "T";
    Shape[Shape["J"] = 3] = "J";
    Shape[Shape["L"] = 4] = "L";
    Shape[Shape["S"] = 5] = "S";
    Shape[Shape["Z"] = 6] = "Z";
})(Shape || (Shape = {}));
var FBlock = (function () {
    function FBlock() {
        //7 shapes
        var s = Math.floor(Math.random() * 7);
        var baseX = Math.floor(N / 2);
        var baseY = N - 1;
        switch (s) {
            case Shape.I:
                this.pivot = [baseX + .5, baseY - .5];
                this.points = [
                    [baseX - 1, baseY],
                    [baseX, baseY],
                    [baseX + 1, baseY],
                    [baseX + 2, baseY]
                ];
                break;
            case Shape.O:
                this.pivot = [baseX - .5, baseY - .5];
                this.points = [
                    [baseX - 1, baseY],
                    [baseX, baseY],
                    [baseX - 1, baseY - 1],
                    [baseX, baseY - 1]
                ];
                break;
            case Shape.T:
                this.pivot = [baseX, baseY - 1];
                this.points = [
                    [baseX, baseY],
                    [baseX - 1, baseY - 1],
                    [baseX, baseY - 1],
                    [baseX + 1, baseY - 1]
                ];
                break;
            case Shape.J:
                this.pivot = [baseX, baseY - 1];
                this.points = [
                    [baseX - 1, baseY],
                    [baseX - 1, baseY - 1],
                    [baseX, baseY - 1],
                    [baseX + 1, baseY - 1]
                ];
                break;
            case Shape.L:
                this.pivot = [baseX, baseY - 1];
                this.points = [
                    [baseX + 1, baseY],
                    [baseX - 1, baseY - 1],
                    [baseX, baseY - 1],
                    [baseX + 1, baseY - 1]
                ];
                break;
            case Shape.S:
                this.pivot = [baseX, baseY - 1];
                this.points = [
                    [baseX, baseY],
                    [baseX + 1, baseY],
                    [baseX - 1, baseY - 1],
                    [baseX, baseY - 1]
                ];
                break;
            case Shape.Z:
                this.pivot = [baseX, baseY - 1];
                this.points = [
                    [baseX - 1, baseY],
                    [baseX, baseY],
                    [baseX, baseY - 1],
                    [baseX + 1, baseY - 1]
                ];
                break;
        }
    }
    return FBlock;
}());
var CBlock = (function () {
    function CBlock(pivot, points) {
        this.pivot = pivot;
        this.points = points;
    }
    return CBlock;
}());
//Empty Array Initializations
function falseArray(n) {
    return Array.apply(null, Array(n)).map(function (i) { return false; });
}
function emptyMatrix(n) {
    return Array.apply(null, Array(n)).map(function (i) { return falseArray(n); });
}
//Display Matrices
function printMatrix(m) {
    console.log();
    for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
        var r = m_1[_i];
        console.log(r.join("")
            .replace(/false/g, "_")
            .replace(/true/g, "0"));
    }
}
function renderMatrix(matrix) {
    $("#game-div").html("");
    for (var i = N - 1; i >= 0; i--) {
        for (var j = 0; j < N; j++) {
            if (matrix[j][i]) {
                $("#game-div").append($("<div>", { class: "dark-box" }));
            }
            else {
                $("#game-div").append($("<div>", { class: "light-box" }));
            }
        }
    }
}
//To update display matrix
function updateMatrix(m, f, c) {
    for (var r = 0; r < m.length; r++) {
        for (var c_1 = 0; c_1 < m[0].length; c_1++) {
            m[r][c_1] = false;
        }
    }
    for (var _i = 0, _a = f.concat(c); _i < _a.length; _i++) {
        var i = _a[_i];
        var x = i[0], y = i[1];
        m[x][y] = true;
    }
}
//Matrix transformations
function translatePoint(point, x, y) {
    return [point[0] + x, point[1] + y];
}
function translateArray(ar, x, y) {
    return ar.map(function (i) { return translatePoint(i, x, y); });
}
function rotateCounterClockwise(ar, p) {
    function rcc(c) {
        var x = c[0], y = c[1];
        return [-y, x];
    }
    var arTran = translateArray(ar, -p[0], -p[1]);
    var arRot = arTran.map(rcc);
    return translateArray(arRot, p[0], p[1]);
}
function rotateClockwise(ar, p) {
    function rc(c) {
        var x = c[0], y = c[1];
        return [y, -x];
    }
    var arTran = translateArray(ar, -p[0], -p[1]);
    var arRot = arTran.map(rc);
    return translateArray(arRot, p[0], p[1]);
}
//Iteration functions
function getFloor() {
    var floor = [];
    for (var i = 0; i < N; i++) {
        floor.push([i, -1]);
    }
    return floor;
}
function getCeiling() {
    var ceil = [];
    for (var i = 0; i < N; i++) {
        ceil.push([i, 25]);
    }
    return ceil;
}
function shiftPoint(x, y, xA, yA, block) {
    var index = block.indexOf([x, y]);
    if (index > -1) {
        block.splice(index, 1);
        block.push([x + xA, y + yA]);
    }
}
function shiftShell(d, c) {
    for (var i = -d + 2; i <= d - 1; i++) {
        shiftPoint(MID + i, MID + 4, 0, -1, c);
        shiftPoint(MID + 4, MID - i, -1, 0, c);
        shiftPoint(MID - 4, MID + i, 1, 0, c);
        shiftPoint(MID - i, MID - 4, 0, 1, c);
    }
}
function shellFilled(d, c) {
    for (var i = -d; i <= d - 1; i++) {
        if (!(c.includes([MID + i, MID + 4]) &&
            c.includes([MID + 4, MID - i]) &&
            c.includes([MID - 4, MID + i]) &&
            c.includes([MID - i, MID - 4]))) {
            return false;
        }
    }
    return true;
}
function hasCollided(upperBlock, lowerBlock) {
    for (var _i = 0, upperBlock_1 = upperBlock; _i < upperBlock_1.length; _i++) {
        var uCoord = upperBlock_1[_i];
        for (var _a = 0, lowerBlock_1 = lowerBlock; _a < lowerBlock_1.length; _a++) {
            var lCoord = lowerBlock_1[_a];
            var ux = uCoord[0], uy = uCoord[1];
            var lx = lCoord[0], ly = lCoord[1];
            if ((ux - lx) == 0 && uy - ly == 1)
                return true;
        }
    }
    return false;
}
function gameOver(f, c) {
    return hasCollided(f, getFloor()) || hasCollided(getCeiling(), c);
}
function main() {
    var matrix;
    var cBlock = new CBlock([MID, MID], [[MID, MID]]);
    var fBlock = new FBlock();
    matrix = emptyMatrix(N);
    updateMatrix(matrix, fBlock.points, cBlock.points);
    renderMatrix(matrix);
    var blocked = false;
    window.addEventListener('keyup', function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        var keyUpAr = 38;
        var keyRightAr = 39;
        var keyDownAr = 40;
        var keyLeftAr = 37;
        var keyQ = 81;
        var keyW = 87;
        var keyE = 69;
        var keyR = 82;
        if (!blocked) {
            switch (key) {
                case keyQ:
                    fBlock.points = rotateCounterClockwise(fBlock.points, fBlock.pivot);
                    break;
                case keyW:
                    fBlock.points = rotateClockwise(fBlock.points, fBlock.pivot);
                    break;
                case keyE:
                    cBlock.points = rotateCounterClockwise(cBlock.points, cBlock.pivot);
                    break;
                case keyR:
                    cBlock.points = rotateClockwise(cBlock.points, cBlock.pivot);
                    break;
                case keyRightAr:
                    fBlock.points = translateArray(fBlock.points, 1, 0);
                    fBlock.pivot = translatePoint(fBlock.pivot, 1, 0);
                    break;
                case keyLeftAr:
                    fBlock.points = translateArray(fBlock.points, -1, 0);
                    fBlock.pivot = translatePoint(fBlock.pivot, -1, 0);
                    break;
                case keyDownAr:
                    //e.preventDefault();
                    fBlock.points = translateArray(fBlock.points, 0, -1);
                    fBlock.pivot = translatePoint(fBlock.pivot, 0, -1);
                    break;
            }
            if (hasCollided(fBlock.points, cBlock.points)) {
                cBlock.points = cBlock.points.concat(fBlock.points);
                fBlock = new FBlock();
            }
            updateMatrix(matrix, fBlock.points, cBlock.points);
            renderMatrix(matrix);
        }
    });
    function setTimer() {
        var timer = setInterval(function () {
            blocked = true;
            if (hasCollided(fBlock.points, cBlock.points)) {
                clearInterval(timer);
                //check for deletions
                if (gameOver(fBlock.points, cBlock.points)) {
                }
                else {
                    cBlock.points = cBlock.points.concat(fBlock.points);
                    fBlock = new FBlock();
                    setTimer();
                }
            }
            else {
                fBlock.points = translateArray(fBlock.points, 0, -1);
                fBlock.pivot = translatePoint(fBlock.pivot, 0, -1);
            }
            updateMatrix(matrix, fBlock.points, cBlock.points);
            renderMatrix(matrix);
            blocked = false;
        }, .5 * 1000);
    }
    setTimer();
}
main();
