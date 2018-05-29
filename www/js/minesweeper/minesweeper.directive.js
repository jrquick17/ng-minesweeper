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