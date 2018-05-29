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
                cols:           '=',
                minePercent:    '=',
                rows:           '=',
                unlimitedFlags: '='
            },
            templateUrl:  'minesweeper.html'
        };
    }
})();