(function() {
    'use strict';

    angular.module('minesweeper').controller(
        'MinesweeperController',
        MinesweeperController
    );

    MinesweeperController.$inject = [
        '$scope',
        'MinesweeperService'
    ];

    function MinesweeperController(
        $scope,
        MinesweeperService
    ) {
        var MinesweeperController = this;

        MinesweeperController.DEFAULT_COLS = 5;
        MinesweeperController.DEFAULT_ROWS = 5;

        MinesweeperController.MAX_COLS = 144;
        MinesweeperController.MAX_ROWS = 144;

        $scope.$watch(
            'minePercent',
            function(minePercent) {
                MinesweeperController.minePercent = MinesweeperController.get(
                    minePercent,
                    0.15
                );
            }
        );

        $scope.$watch(
            'cols',
            function(cols) {
                MinesweeperController.cols = MinesweeperController.get(
                    cols,
                    MinesweeperController.DEFAULT_COLS
                );

                if (MinesweeperController.cols > MinesweeperController.MAX_COLS) {
                    MinesweeperController.cols = MinesweeperController.MAX_COLS;
                }
            }
        );

        $scope.$watch(
            'rows',
            function(rows) {
                MinesweeperController.rows = MinesweeperController.get(
                    rows,
                    MinesweeperController.DEFAULT_ROWS
                );

                if (MinesweeperController.cols > MinesweeperController.MAX_ROWS) {
                    MinesweeperController.cols = MinesweeperController.MAX_ROWS;
                }

                MinesweeperController.buildBoard();
            }
        );

        MinesweeperController.buildBoard = buildBoard;
        function buildBoard() {
            MinesweeperController.cells = [];

            MinesweeperController.cellCount = MinesweeperController.cols * MinesweeperController.rows;
            for (var i = 0; i < MinesweeperController.cellCount; i++) {
                var cell = {};

                cell.hasFlag = false;
                cell.hasMine = Math.random() <= MinesweeperController.minePercent;
                cell.isUnknown = true;

                var col = i % MinesweeperController.cols;
                var row = Math.floor(i / MinesweeperController.cols);

                cell.col = col;
                cell.row = row;

                if (col === 0) {
                    MinesweeperController.cells[row] = [];
                }

                MinesweeperController.cells[row][col] = cell;
            }

            for (var j = 0; j < MinesweeperController.rows; j++) {
                for (var k = 0; k < MinesweeperController.cols; k++) {
                    MinesweeperController.cells[j][k].touches = MinesweeperController.countTouches(
                        MinesweeperController.cells[j][k]
                    );
                }
            }
        }

        MinesweeperController.click = click;
        function click(cell) {
            cell.isUnknown = false;
        }

        MinesweeperController.countTouches = countTouches;
        function countTouches(cell) {
            var col = cell.col;
            var row = cell.row;

            var touches = 0;
            if (col !== 0 && MinesweeperController.cells[row][col - 1].hasMine) { // LEFT
                touches++;
            }
            if (col + 1 !== MinesweeperController.cols && MinesweeperController.cells[row][col + 1].hasMine) { // RIGHT
                touches++;
            }
            if (row !== 0 && MinesweeperController.cells[row - 1][col].hasMine) { // TOP
                touches++;
            }
            if (row + 1 !== MinesweeperController.rows && MinesweeperController.cells[row + 1][col].hasMine) { // BOTTOM
                touches++;
            }
            if (col !== 0 && row + 1 !== MinesweeperController.rows && MinesweeperController.cells[row + 1][col - 1].hasMine) { // BOTTOM LEFT
                touches++;
            }
            if (col + 1 !== MinesweeperController.cols && row + 1 !== MinesweeperController.rows && MinesweeperController.cells[row + 1][col + 1].hasMine) { // BOTTOM RIGHT
                touches++;
            }
            if (col !== 0 && row !== 0 && MinesweeperController.cells[row - 1][col - 1].hasMine) { // TOP LEFT
                touches++;
            }
            if (col + 1 !== MinesweeperController.cols && row !== 0 && MinesweeperController.cells[row - 1][col + 1].hasMine) { // TOP RIGHT
                touches++;
            }

            return touches;
        }
        
        MinesweeperController.get = get;
        function get(alpha, beta) {
            var value = null;
            
            if (typeof alpha === 'undefined') {
                if (typeof beta !== 'undefined') {
                    value = beta;
                }
            }

            return value;
        }

        MinesweeperController.reset = reset;
        function reset() {

        }

        MinesweeperController.init = init;
        function init() {
            MinesweeperController.reset();
        }

        MinesweeperController.init();
    }
})();