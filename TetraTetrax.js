//https://raw.githubusercontent.com/clark-stevenson/paper.d.ts/master/paper.d.ts
///<reference path="paper.d.ts"/>
var N = 25;
var matrix;
var fBlock = [];
var cBlock = [[0, 0]];
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
        var x = i[0] + (N - 1) / 2;
        var y = i[1] + (N - 1) / 2;
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
        printMatrix(matrix);
    }
    return false;
}
function checkPerim(d, c) {
    for (var i = -d; i <= d; i++) {
        if (c.indexOf([-d, i]) == -1)
            return false;
        if (c.indexOf([d, i]) == -1)
            return false;
        if (c.indexOf([i, -d]) == -1)
            return false;
        if (c.indexOf([i, d]) == -1)
            return false;
    }
}
function delPerim(d, c) {
    for (var i = -d + 2; i < d; i++) {
        console.log("Hello");
    }
}
function testDir(d) {
    console.log(d);
}
testDir("EAST");
matrix = emptyMatrix(N);
printMatrix(matrix);
updateMatrix(matrix, fBlock, cBlock);
printMatrix(matrix);
var t = new paper.Matrix(1, 0, 0, 1, 0, 0);
console.log(t.toString());
t.rotate(90, new paper.Point(0, 0));
console.log(t.toString());
var src = [[1, 1]].reduce(function (z, i) { return z.concat(i); }, []);
var dst = [];
console.log(t.transform(src, dst, 1));
