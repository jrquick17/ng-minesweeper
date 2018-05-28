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
            template:'<div class="row" data-ng-repeat="cols in ctrl.cells"><div data-ng-repeat="cell in cols" class="col cell" data-ng-class="{ \'clear\': !cell.isUnknown && !cell.hasMine && cell.touches === 0, \'mine\': !cell.isUnknown && cell.hasMine, \'safe\': !cell.isUnknown && !cell.hasMine && cell.touches !== 0, \'flag\': cell.isUnknown && cell.hasFlag, \'unknown\': cell.isUnknown && !cell.hasFlag, \'touches-0\': cell.touches === 0, \'touches-1\': cell.touches === 1, \'touches-2\': cell.touches === 2, \'touches-3\': cell.touches === 3, \'touches-4\': cell.touches === 4, \'touches-5\': cell.touches === 5, \'touches-6\': cell.touches === 6, \'touches-7\': cell.touches === 7, \'touches-8\': cell.touches === 8 }" data-ng-mousedown="ctrl.click($event, cell)" oncontextmenu="return false"><p data-ng-if="cell.isUnknown">~</p><p data-ng-if="!cell.isUnknown">{{ cell.hasMine ? \'X\' : cell.touches }}</p></div></div>'
        };
    }
})();