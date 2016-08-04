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
function falseArray(n) {
    return Array.apply(null, Array(n)).map(function (i) { return false; });
}
function emptyMatrix(n) {
    return Array.apply(null, Array(n)).map(function (i) { return falseArray(n); });
}
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
function printMatrix(m) {
    console.log();
    for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
        var r = m_1[_i];
        console.log(r.join("")
            .replace(/false/g, "_")
            .replace(/true/g, "0"));
    }
}
function hasCollided(f, c) {
    for (var _i = 0, f_1 = f; _i < f_1.length; _i++) {
        var fCoord = f_1[_i];
        for (var _a = 0, c_2 = c; _a < c_2.length; _a++) {
            var cCoord = c_2[_a];
            var x1 = fCoord[0];
            var y1 = fCoord[1];
            var x2 = cCoord[0];
            var y2 = cCoord[1];
            if (Math.abs(x1 - x2) == 1 && Math.abs(y2 - y1) == 0)
                return true;
            if (Math.abs(x1 - x2) == 0 && Math.abs(y2 - y1) == 1)
                return true;
        }
    }
    return false;
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
function getFloor() {
    var floor = [];
    for (var i = 0; i < N; i++) {
        floor.push([i, -1]);
    }
    return floor;
}
function gameOver(f) {
    return hasCollided(f, getFloor());
}
function setTimer() {
    var timer = setInterval(function () {
        if (hasCollided()) {
            clearInterval(timer);
            //check for deletions
            if (gameOver) {
            }
            else {
                //reset block
                setTimer();
            }
        }
        //fall block
    }, 1 * 1000);
}
var m2 = emptyMatrix(N);
function shiftPoint(x, y, xA, yA, block) {
    m2[x][y] = true;
    //remove x, y from Block
    //add [x+xA, y+yA] to block 
}
function shiftShell(d) {
    var block;
    for (var i = -d + 2; i <= d - 1; i++) {
        shiftPoint(MID + i, MID + 4, 0, -1, block);
        shiftPoint(MID + 4, MID - i, -1, 0, block);
        shiftPoint(MID - 4, MID + i, 1, 0, block);
        shiftPoint(MID - i, MID - 4, 0, 1, block);
    }
}
function shellFilled(d) {
    var block;
    for (var i = -d; i <= d - 1; i++) {
        shiftPoint(MID + i, MID + 4, 0, -1, block);
        shiftPoint(MID + 4, MID - i, -1, 0, block);
        shiftPoint(MID - 4, MID + i, 1, 0, block);
        shiftPoint(MID - i, MID - 4, 0, 1, block);
    }
}
shellFilled(4);
renderMatrix(m2);
function main() {
    var matrix;
    var cBlock = new CBlock([MID, MID], [[MID, MID]]);
    var fBlock = new FBlock();
    matrix = emptyMatrix(N);
    updateMatrix(matrix, fBlock.points, cBlock.points);
    //renderMatrix(matrix);
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
        switch (key) {
            case keyQ:
                //console.log(fBlock.points);
                //console.log(fBlock.pivot);
                //console.log(rotateCounterClockwise(fBlock.points, fBlock.pivot));
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
        if (hasCollided(cBlock.points, fBlock.points)) {
            cBlock.points = cBlock.points.concat(fBlock.points);
            fBlock = new FBlock();
        }
        updateMatrix(matrix, fBlock.points, cBlock.points);
        renderMatrix(matrix);
    });
}
main();
