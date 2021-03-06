(function () {
    'use strict';

    angular.module('mvSucursalesAdministracion', [])
        .component('mvSucursalesAdministracion', mvSucursalesAdministracion());

    function mvSucursalesAdministracion() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: window.installPath + '/mv-angular-sucursales/mv-sucursales-administracion.html',
            controller: MvSucursalController
        }
    }

    MvSucursalController.$inject = ["SucursalesVars", 'SucursalesService', "MvUtils"];
    /**
     * @param AcUsuarios
     * @constructor
     */
    function MvSucursalController(SucursalesVars, SucursalesService, MvUtils) {
        var vm = this;

        vm.sucursales = [];
        vm.sucursal = {};
        vm.detailsOpen = false;

        vm.save = save;
        vm.cancel = cancel;
        vm.setData = setData;
        vm.loadSucursales = loadSucursales;
        vm.remove = remove;

        loadSucursales();

        function loadSucursales() {
            SucursalesService.get().then(function (data) {
                setData(data);
            });
        }

        function save() {
            //console.log(vm.sucursal);

            if(vm.sucursal.telefono != undefined && vm.sucursal.telefono.length > 0) {
                if(!MvUtils.validaTelefono(vm.sucursal.telefono)) {
                    MvUtils.showMessage('error', 'El formato del teléfono no es correcto.');
                    return;
                }
            }

            if(vm.sucursal.nombre === undefined || vm.sucursal.direccion === undefined) {
                MvUtils.showMessage('error', 'El nombre y la dirección no pueden ser vacio');
                return;
            } else {
                SucursalesService.save(vm.sucursal).then(function (data) {
                    vm.sucursal = {};
                    vm.detailsOpen = (data === undefined || data < 0) ? true : false;
                    loadSucursales();
                    if(data === undefined)
                        MvUtils.showMessage('error', 'Error actualizando el dato');
                    else
                        MvUtils.showMessage('success', 'La operación se realizó satisfactoriamente');
                }).catch(function (data) {
                    vm.sucursal = {};
                    vm.detailsOpen = true;
                });
            }

        }

        function setData(data) {
            vm.sucursales = data;
            vm.paginas = SucursalesVars.paginas;
        }

        function remove() {
            if(vm.sucursal.sucursal_id == undefined) {
                alert('Debe seleccionar una sucursal');
            } else {
                var result = confirm('¿Esta seguro que desea eliminar la sucursal seleccionada?');
                if(result) {
                    SucursalesService.remove(vm.sucursal.sucursal_id, function(data){
                        vm.sucursal = {};
                        vm.detailsOpen = false;
                        loadSucursales();
                        MvUtils.showMessage('success', 'La registro se borro satisfactoriamente');
                    });
                }
            }
        }


        function cancel() {
            vm.sucursales = [];
            vm.sucursal={};
            vm.detailsOpen=false;
            SucursalesVars.clearCache = true;
            loadSucursales();
        }


        // Implementación de la paginación
        vm.start = 0;
        vm.limit = SucursalesVars.paginacion;
        vm.pagina = SucursalesVars.pagina;
        vm.paginas = SucursalesVars.paginas;

        function paginar(vars) {
            if (vars == {}) {
                return;
            }
            vm.start = vars.start;
            vm.pagina = vars.pagina;
        }

        vm.next = function () {
            paginar(MvUtils.next(SucursalesVars));
        };
        vm.prev = function () {
            paginar(MvUtils.prev(SucursalesVars));
        };
        vm.first = function () {
            paginar(MvUtils.first(SucursalesVars));
        };
        vm.last = function () {
            paginar(MvUtils.last(SucursalesVars));
        };

        vm.goToPagina = function () {
            paginar(MvUtils.goToPagina(vm.pagina, SucursalesVars));
        }

    }


})();
