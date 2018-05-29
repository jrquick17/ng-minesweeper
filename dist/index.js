(function() {
    'use strict';

})();
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

        MinesweeperController.DEFAULT_COLS = 10;
        MinesweeperController.DEFAULT_ROWS = 6;

        MinesweeperController.MIN_COLS = 3;
        MinesweeperController.MIN_ROWS = 3;

        MinesweeperController.MAX_COLS = 48;
        MinesweeperController.MAX_ROWS = 48;

        MinesweeperController.mineCount = 0;

        $scope.$watch(
            'minePercent',
            function(minePercent) {
                MinesweeperController.minePercent = MinesweeperController.get(
                    minePercent,
                    0.12
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
                } else if (MinesweeperController.cols < MinesweeperController.MIN_COLS) {
                    MinesweeperController.cols = MinesweeperController.MIN_COLS;
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

                if (MinesweeperController.rows > MinesweeperController.MAX_ROWS) {
                    MinesweeperController.rows = MinesweeperController.MAX_ROWS;
                } else if (MinesweeperController.rows < MinesweeperController.MIN_ROWS) {
                    MinesweeperController.rows = MinesweeperController.MIN_ROWS;
                }

                MinesweeperController.buildBoard();
            }
        );

        MinesweeperController.buildBoard = buildBoard;
        function buildBoard() {
            MinesweeperController.cells = [];

            for (var i = 0; i < MinesweeperController.rows; i++) {
                MinesweeperController.cells[i] = [];

                for (var j = 0; j < MinesweeperController.cols; j++) {
                    var cell = {};

                    cell.hasFlag = false;

                    cell.hasMine = Math.random() <= MinesweeperController.minePercent;
                    if (cell.hasMine) {
                        MinesweeperController.mineCount++;
                    }

                    cell.isClear = false;

                    cell.col = j;
                    cell.row = i;

                    MinesweeperController.cells[i][j] = cell;
                }
            }

            for (var k = 0; k < MinesweeperController.rows; k++) {
                for (var l = 0; l < MinesweeperController.cols; l++) {
                    MinesweeperController.cells[k][l].touches = MinesweeperController.countTouches(
                        MinesweeperController.cells[k][l]
                    );
                }
            }
        }

        MinesweeperController.checkEnd = checkEnd;
        function checkEnd() {
            for (var i = 0; i < MinesweeperController.rows; i++) {
                for (var j = 0; j < MinesweeperController.cols; j++) {
                    if (!MinesweeperController.cells[i][j].isClear) {
                        if (!MinesweeperController.cells[i][j].hasFlag) {
                            return false;
                        } else if (!MinesweeperController.cells[i][j].hasMine) {
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        MinesweeperController.clearNeighbors = clearNeighbors;
        function clearNeighbors(cell) {
            var neighbors = MinesweeperController.getNeighbors(cell);
            var neighborsCount = neighbors.length;

            for (var i = 0; i < neighborsCount; i++) {
                var neighbor = neighbors[i];

                if (!neighbor.isClear && !neighbor.hasMine) {
                    MinesweeperController.clearCell(neighbor);
                }
            }
        }

        MinesweeperController.clearCell = clearCell;
        function clearCell(cell) {
            if (!cell.hasFlag) {
                cell.isClear = true;

                if (cell.hasMine) {
                    MinesweeperController.showMessage('BOOM!', 'Game Over');

                    MinesweeperController.gameover = true;
                } else {
                    if (cell.touches === 0) {
                        MinesweeperController.clearNeighbors(cell);
                    }
                }
            }
        }

        MinesweeperController.click = click;
        function click(event, cell) {
            if (!MinesweeperController.gameover) {
                if (event.which === 1) {
                    MinesweeperController.clearCell(cell);
                } else if (event.which === 3) {
                    MinesweeperController.setFlag(cell);
                }

                var gameOver = MinesweeperController.checkEnd();
                if (gameOver) {
                    MinesweeperController.showMessage('Good game.', 'Game Over');

                    MinesweeperController.gameover = true;
                }
            }
        }

        MinesweeperController.closeModal = closeModal;
        function closeModal() {
            $('#modal').modal('hide');
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
                    neighbors.push(neighbor);
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
            if (cell.col !== 0 && cell.row + 1 !== MinesweeperController.rows) {
                return MinesweeperController.cells[cell.row + 1][cell.col - 1];
            }

            return null;
        }

        MinesweeperController.getNeighborBottomRight = getNeighborBottomRight;
        function getNeighborBottomRight(cell) {
            if (cell.col + 1 !== MinesweeperController.cols && cell.row + 1 !== MinesweeperController.rows) {
                return MinesweeperController.cells[cell.row + 1][cell.col + 1];
            }

            return null;
        }

        MinesweeperController.getNeighborLeft = getNeighborLeft;
        function getNeighborLeft(cell) {
            if (cell.col !== 0) {
                return MinesweeperController.cells[cell.row][cell.col - 1];
            }

            return null;
        }

        MinesweeperController.getNeighborRight = getNeighborRight;
        function getNeighborRight(cell) {
            if (cell.col + 1 !== MinesweeperController.cols) {
                return MinesweeperController.cells[cell.row][cell.col + 1];
            }

            return null;
        }

        MinesweeperController.getNeighborTop = getNeighborTop;
        function getNeighborTop(cell) {
            if (cell.row !== 0) {
                return MinesweeperController.cells[cell.row - 1][cell.col];
            }

            return null;
        }

        MinesweeperController.getNeighborTopLeft = getNeighborTopLeft;
        function getNeighborTopLeft(cell) {
            if (cell.col !== 0 && cell.row !== 0) {
                return MinesweeperController.cells[cell.row - 1][cell.col - 1];
            }

            return null;
        }

        MinesweeperController.getNeighborTopRight = getNeighborTopRight;
        function getNeighborTopRight(cell) {
            if (cell.col + 1 !== MinesweeperController.cols && cell.row !== 0) {
                return MinesweeperController.cells[cell.row - 1][cell.col + 1];
            }

            return null;
        }

        MinesweeperController.restart = restart;
        function restart() {
            MinesweeperController.reset();
            MinesweeperController.buildBoard();
        }

        MinesweeperController.setFlag = setFlag;
        function setFlag(cell) {
            if (MinesweeperController.flagsUsed < MinesweeperController.mineCount) {
                if (!cell.isClear) {
                    if (cell.hasFlag) {
                        cell.hasFlag = false;

                        MinesweeperController.flagsUsed--;
                    } else {
                        cell.hasFlag = true;

                        MinesweeperController.flagsUsed++;
                    }
                }
            } else {
                MinesweeperController.showMessage('No more flags left.');
            }
        }

        MinesweeperController.showMessage = showMessage;
        function showMessage(message, title) {
            MinesweeperController.message = message;

            MinesweeperController.title = MinesweeperController.get(
                title,
                'Message'
            );

            $('#modal').modal('show');
        }

        MinesweeperController.toggleSettings = toggleSettings;
        function toggleSettings() {
            MinesweeperController.showSettings = !MinesweeperController.showSettings;
        }

        MinesweeperController.reset = reset;
        function reset() {
            MinesweeperController.flagsUsed = 0;

            MinesweeperController.gameover = false;

            MinesweeperController.message = '';

            MinesweeperController.showSettings = false;

            MinesweeperController.title = '';
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
            template:'<div class="global-wrapper"><div class="row"><div class="col"><button data-ng-if="ctrl.gameover" type="button" class="btn btn-default btn-sm float-left" data-ng-click="ctrl.restart()"><img src="node_modules/octicons/build/svg/triangle-right.svg"> PLAY AGAIN</button> <button data-ng-if="!ctrl.gameover" type="button" class="btn btn-default btn-sm float-left" data-ng-click="ctrl.restart()"><img src="node_modules/octicons/build/svg/sync.svg"> RESET</button></div><div class="col text-center">MINESWEEPER</div><div class="col"><button type="button" class="btn btn-default btn-sm float-right" data-ng-click="ctrl.toggleSettings()"><img src="node_modules/octicons/build/svg/gear.svg"> SETTINGS</button></div></div><div class="board"><div data-ng-if="!ctrl.showSettings" class="row no-gutters" data-ng-class="{ \'gameover\': ctrl.gameover }" data-ng-repeat="cols in ctrl.cells"><div data-ng-repeat="cell in cols" class="col" data-ng-class="{ \'clear\': cell.isClear && !cell.hasMine && cell.touches === 0, \'mine\': cell.isClear && cell.hasMine, \'safe\': cell.isClear && !cell.hasMine && cell.touches !== 0, \'flag\': !cell.isClear && cell.hasFlag, \'unknown\': !cell.isClear && !cell.hasFlag, \'touches-0\': cell.touches === 0, \'touches-1\': cell.touches === 1, \'touches-2\': cell.touches === 2, \'touches-3\': cell.touches === 3, \'touches-4\': cell.touches === 4, \'touches-5\': cell.touches === 5, \'touches-6\': cell.touches === 6, \'touches-7\': cell.touches === 7, \'touches-8\': cell.touches === 8 }" data-ng-mousedown="ctrl.click($event, cell)" oncontextmenu="return false"><div class="dummy"></div><div class="cell"><div data-ng-if="cell.isClear">{{ cell.hasMine ? \'X\' : cell.touches }}</div></div></div></div></div><div data-ng-if="ctrl.showSettings"><div class="row"><div class="col text-center">SETTINGS</div></div><div class="row"><button class="btn btn-primary btn-block" data-ng-click="ctrl.toggleSettings()">EXIT</button></div></div></div><div id="modal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">{{ ctrl.title }}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">{{ ctrl.message }}</div><div class="modal-footer"><button type="button" class="btn btn-primary btn-block" data-ng-click="ctrl.closeModal()">Close</button></div></div></div></div>'
        };
    }
})();