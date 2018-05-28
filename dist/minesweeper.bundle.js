(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function () {
    'use strict';
})();
(function () {
    'use strict';

    angular.module('minesweeper', []);
})();
(function () {
    'use strict';

    angular.module('minesweeper').service('MinesweeperService', MinesweeperService);

    MinesweeperService.$inject = [];

    function MinesweeperService() {
        var MinesweeperService = this;

        MinesweeperService.reset = reset;
        function reset() {}

        MinesweeperService.reset();

        return MinesweeperService;
    }
})();
(function () {
    'use strict';

    angular.module('minesweeper').controller('MinesweeperController', MinesweeperController);

    MinesweeperController.$inject = ['$scope', 'MinesweeperService'];

    function MinesweeperController($scope, MinesweeperService) {
        var MinesweeperController = this;

        MinesweeperController.DEFAULT_COLS = 5;
        MinesweeperController.DEFAULT_ROWS = 5;

        MinesweeperController.MAX_COLS = 144;
        MinesweeperController.MAX_ROWS = 144;

        $scope.$watch('minePercent', function (minePercent) {
            MinesweeperController.minePercent = MinesweeperController.get(minePercent, 0.15);
        });

        $scope.$watch('cols', function (cols) {
            MinesweeperController.cols = MinesweeperController.get(cols, MinesweeperController.DEFAULT_COLS);

            if (MinesweeperController.cols > MinesweeperController.MAX_COLS) {
                MinesweeperController.cols = MinesweeperController.MAX_COLS;
            }
        });

        $scope.$watch('rows', function (rows) {
            MinesweeperController.rows = MinesweeperController.get(rows, MinesweeperController.DEFAULT_ROWS);

            if (MinesweeperController.cols > MinesweeperController.MAX_ROWS) {
                MinesweeperController.cols = MinesweeperController.MAX_ROWS;
            }

            MinesweeperController.buildBoard();
        });

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
                    MinesweeperController.cells[j][k].touches = MinesweeperController.countTouches(MinesweeperController.cells[j][k]);
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
            if (col !== 0 && MinesweeperController.cells[row][col - 1].hasMine) {
                // LEFT
                touches++;
            }
            if (col + 1 !== MinesweeperController.cols && MinesweeperController.cells[row][col + 1].hasMine) {
                // RIGHT
                touches++;
            }
            if (row !== 0 && MinesweeperController.cells[row - 1][col].hasMine) {
                // TOP
                touches++;
            }
            if (row + 1 !== MinesweeperController.rows && MinesweeperController.cells[row + 1][col].hasMine) {
                // BOTTOM
                touches++;
            }
            if (col !== 0 && row + 1 !== MinesweeperController.rows && MinesweeperController.cells[row + 1][col - 1].hasMine) {
                // BOTTOM LEFT
                touches++;
            }
            if (col + 1 !== MinesweeperController.cols && row + 1 !== MinesweeperController.rows && MinesweeperController.cells[row + 1][col + 1].hasMine) {
                // BOTTOM RIGHT
                touches++;
            }
            if (col !== 0 && row !== 0 && MinesweeperController.cells[row - 1][col - 1].hasMine) {
                // TOP LEFT
                touches++;
            }
            if (col + 1 !== MinesweeperController.cols && row !== 0 && MinesweeperController.cells[row - 1][col + 1].hasMine) {
                // TOP RIGHT
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
        function reset() {}

        MinesweeperController.init = init;
        function init() {
            MinesweeperController.reset();
        }

        MinesweeperController.init();
    }
})();
(function () {
    'use strict';

    angular.module('minesweeper').directive('minesweeper', minesweeper);

    function minesweeper() {
        return {
            controller: 'MinesweeperController',
            controllerAs: 'ctrl',
            restrict: 'E',
            scope: {
                cols: '=',
                minePercent: '=',
                rows: '='
            },
            template: '<div class="row" data-ng-repeat="cols in ctrl.cells"><div data-ng-repeat="cell in cols" class="col cell" data-ng-class="{ \'clear\': !cell.isUnknown && !cell.hasMine && cell.touches === 0, \'mine\': !cell.isUnknown && cell.hasMine, \'safe\': !cell.isUnknown && !cell.hasMine && cell.touches !== 0, \'flag\': cell.isUnknown && cell.hasFlag, \'unknown\': cell.isUnknown && !cell.hasFlag, \'touches-0\': cell.touches === 0, \'touches-1\': cell.touches === 1, \'touches-2\': cell.touches === 2, \'touches-3\': cell.touches === 3, \'touches-4\': cell.touches === 4, \'touches-5\': cell.touches === 5, \'touches-6\': cell.touches === 6, \'touches-7\': cell.touches === 7, \'touches-8\': cell.touches === 8 }" data-ng-click="ctrl.click(cell)">{{ cell.hasMine ? \'X\' : cell.touches }}</div></div>'
        };
    }
})();

},{}]},{},[1]);

//# sourceMappingURL=minesweeper.bundle.js.map
