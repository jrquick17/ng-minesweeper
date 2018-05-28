(function() {
    'use strict';

    angular.module('minesweeper', []);
})();
(function() {
    'use strict';

    angular.module('minesweeper').service(
        'MinesweeperService',
        MinesweeperService
    );

    MinesweeperService.$inject = [];

    function MinesweeperService() {
        var MinesweeperService = this;

        MinesweeperService.reset = reset;
        function reset() {

        }
        
        MinesweeperService.reset();

        return MinesweeperService;
    }
})();
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

        MinesweeperController.clearNeighbors = clearNeighbors;
        function clearNeighbors(cell) {
            var neighbors = MinesweeperController.getNeighbors(cell);
            var neighborsCount = neighbors.length;

            for (var i = 0; i < neighborsCount; i++) {
                var neighbor = neighbors[i];

                if (neighbor.isUnknown && !neighbor.hasMine) {
                    MinesweeperController.click(neighbor);
                }
            }
        }

        MinesweeperController.click = click;
        function click(cell) {
            cell.isUnknown = false;

            if (!cell.hasMine) {
                if (cell.touches === 0) {
                    MinesweeperController.clearNeighbors(cell);
                }
            }
        }

        MinesweeperController.countTouches = countTouches;
        function countTouches(cell) {
            var touches = 0;

            var neighbors = MinesweeperController.getNeighbors(cell);
            var neighborCount = neighbors.length;

            for (var i = 0; i < neighborCount; i++) {
                var neighbor = neighbors[i];

                if (neighbor.hasMine) {
                    touches++;
                }
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

        MinesweeperController.getNeighbors = getNeighbors;
        function getNeighbors(cell) {
            var neighbors = [];

            var neighborFunctions = [
                'getNeighborBottom',
                'getNeighborBottomLeft',
                'getNeighborBottomRight',
                'getNeighborLeft',
                'getNeighborRight',
                'getNeighborTop',
                'getNeighborTopLeft',
                'getNeighborTopRight'
            ];

            var neighborFunctionsCount = neighborFunctions.length;

            for (var i = 0; i < neighborFunctionsCount; i++) {
                var neighborFunction = neighborFunctions[i];

                var neighbor = MinesweeperController[neighborFunction](cell);
                if (neighbor !== null) {
                    neighbors.push(neighbor)
                }
            }

            return neighbors;
        }

        MinesweeperController.getNeighborBottom = getNeighborBottom;
        function getNeighborBottom(cell) {
            if (cell.row + 1 !== MinesweeperController.rows) {
                return MinesweeperController.cells[cell.row + 1][cell.col];
            }

            return null;
        }

        MinesweeperController.getNeighborBottomLeft = getNeighborBottomLeft;
        function getNeighborBottomLeft(cell) {
            return cell.col !== 0 && cell.row + 1 !== MinesweeperController.rows && MinesweeperController.cells[cell.row + 1][cell.col - 1];
        }

        MinesweeperController.getNeighborBottomRight = getNeighborBottomRight;
        function getNeighborBottomRight(cell) {
            return cell.col + 1 !== MinesweeperController.cols && cell.row + 1 !== MinesweeperController.rows && MinesweeperController.cells[cell.row + 1][cell.col + 1];
        }

        MinesweeperController.getNeighborLeft = getNeighborLeft;
        function getNeighborLeft(cell) {
            return cell.col !== 0 && MinesweeperController.cells[cell.row][cell.col - 1];
        }

        MinesweeperController.getNeighborRight = getNeighborRight;
        function getNeighborRight(cell) {
            return cell.col + 1 !== MinesweeperController.cols && MinesweeperController.cells[cell.row][cell.col + 1];
        }

        MinesweeperController.getNeighborTop = getNeighborTop;
        function getNeighborTop(cell) {
            return cell.row !== 0 && MinesweeperController.cells[cell.row - 1][cell.col];
        }

        MinesweeperController.getNeighborTopLeft = getNeighborTopLeft;
        function getNeighborTopLeft(cell) {
            return cell.col !== 0 && cell.row !== 0 && MinesweeperController.cells[cell.row - 1][cell.col - 1];
        }

        MinesweeperController.getNeighborTopRight = getNeighborTopRight;
        function getNeighborTopRight(cell) {
            return cell.col + 1 !== MinesweeperController.cols && cell.row !== 0 && MinesweeperController.cells[cell.row - 1][cell.col + 1]
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
(function() {
    'use strict';

    angular.module('minesweeper').directive(
        'minesweeper',
        minesweeper
    );

    function minesweeper() {
        return {
            controller:   'MinesweeperController',
            controllerAs: 'ctrl',
            restrict:     'E',
            scope:        {
                cols:        '=',
                minePercent: '=',
                rows:        '='
            },
            template:'<div class="row" data-ng-repeat="cols in ctrl.cells"><div data-ng-repeat="cell in cols" class="col cell" data-ng-class="{ \'clear\': !cell.isUnknown && !cell.hasMine && cell.touches === 0, \'mine\': !cell.isUnknown && cell.hasMine, \'safe\': !cell.isUnknown && !cell.hasMine && cell.touches !== 0, \'flag\': cell.isUnknown && cell.hasFlag, \'unknown\': cell.isUnknown && !cell.hasFlag, \'touches-0\': cell.touches === 0, \'touches-1\': cell.touches === 1, \'touches-2\': cell.touches === 2, \'touches-3\': cell.touches === 3, \'touches-4\': cell.touches === 4, \'touches-5\': cell.touches === 5, \'touches-6\': cell.touches === 6, \'touches-7\': cell.touches === 7, \'touches-8\': cell.touches === 8 }" data-ng-click="ctrl.click(cell)">{{ cell.hasMine ? \'X\' : cell.touches }}</div></div>'
        };
    }
})();