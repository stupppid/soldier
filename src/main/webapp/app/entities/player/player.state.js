(function() {
    'use strict';

    angular
        .module('battleApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('player', {
            parent: 'entity',
            url: '/player',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'battleApp.player.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/player/players.html',
                    controller: 'PlayerController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('player');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('player-detail', {
            parent: 'player',
            url: '/player/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'battleApp.player.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/player/player-detail.html',
                    controller: 'PlayerDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('player');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Player', function($stateParams, Player) {
                    return Player.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'player',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('player-detail.edit', {
            parent: 'player-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/player/player-dialog.html',
                    controller: 'PlayerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Player', function(Player) {
                            return Player.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('player.new', {
            parent: 'player',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/player/player-dialog.html',
                    controller: 'PlayerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                mail: null,
                                password: null,
                                image: null,
                                hp: null,
                                money: null,
                                strength: null,
                                agility: null,
                                attack: null,
                                defence: null,
                                fatigue: null,
                                belong: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('player', null, { reload: 'player' });
                }, function() {
                    $state.go('player');
                });
            }]
        })
        .state('player.edit', {
            parent: 'player',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/player/player-dialog.html',
                    controller: 'PlayerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Player', function(Player) {
                            return Player.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('player', null, { reload: 'player' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('player.delete', {
            parent: 'player',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/player/player-delete-dialog.html',
                    controller: 'PlayerDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Player', function(Player) {
                            return Player.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('player', null, { reload: 'player' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
