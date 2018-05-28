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
            template:'<div class="global-wrapper"><div class="row"><div class="col"></div><div class="col text-center">MINESWEEPER</div><div class="col text-right"><button data-ng-click="ctrl.toggleSettings()">SETTINGS</button></div></div><div class="board"><div data-ng-if="!ctrl.showSettings" class="row no-gutters" data-ng-repeat="cols in ctrl.cells"><div data-ng-repeat="cell in cols" class="col" data-ng-class="{ \'clear\': cell.isClear && !cell.hasMine && cell.touches === 0, \'mine\': cell.isClear && cell.hasMine, \'safe\': cell.isClear && !cell.hasMine && cell.touches !== 0, \'flag\': !cell.isClear && cell.hasFlag, \'unknown\': !cell.isClear && !cell.hasFlag, \'touches-0\': cell.touches === 0, \'touches-1\': cell.touches === 1, \'touches-2\': cell.touches === 2, \'touches-3\': cell.touches === 3, \'touches-4\': cell.touches === 4, \'touches-5\': cell.touches === 5, \'touches-6\': cell.touches === 6, \'touches-7\': cell.touches === 7, \'touches-8\': cell.touches === 8 }" data-ng-mousedown="ctrl.click($event, cell)" oncontextmenu="return false"><div class="dummy"></div><div class="cell"><div data-ng-if="cell.isClear">{{ cell.hasMine ? \'X\' : cell.touches }}</div></div></div></div></div><div data-ng-if="ctrl.showSettings"><div class="row"><div class="col text-center">SETTINGS</div></div><div class="row"><button class="bu" data-ng-click="ctrl.toggleSettings()">EXIT</button></div></div></div>'
        };
    }
})();