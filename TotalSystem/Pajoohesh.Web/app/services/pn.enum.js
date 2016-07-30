define(['app'], function (app) {
    app.factory('pn.enum', [function () {
        // TODO Expand This
        var service = {
            pnformstate: {browse:0, insert: 1, update: 2, deletee: 3 },
            pnUserType: {
                personeli: '502b1edb-3f3d-4f82-a198-ba7cdf9c9d4b', real: 'be155ad4-7105-4c74-a8ad-f0df15dc3cf7',
                legal: 'c033e91e-7185-49f3-bc3f-9222233b30fa', system: 'a944bf83-7eca-486c-b2d8-3aac9477de0d'
            },
            roleState: {
                role: '49dae2f7-044f-404d-a3e1-df7afee82814', groupRole: 'f8675864-cb20-417a-ab04-31aae75b7d73'
            }
        };

        return service;
    }
    ]);
});