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