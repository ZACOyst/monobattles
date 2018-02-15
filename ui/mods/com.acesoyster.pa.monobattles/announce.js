handlers.client_state = function (client) {
	var announced = false;
	var message_object = {message: "Unit Announcement Error"};
	var message_base = "!LOC:";

    switch (model.mode()) {
        case 'landing':
            if (client.landing_position || model.isSpectator()) {
                model.landingOk();
                model.setMessage({
                    message: loc('!LOC:Waiting for other players to select a spawn location.')
                });
            }
            else
                model.setMessage({
                    message: loc("!LOC:Pick a location inside one of the green zones to spawn your Commander."),
                    helper: true
                });
            	if (window.HodgePodge && (announced == false)) {
					message_object["message"] = loc(message_base.concat(localStorage.getItem("monobattles_name")));
					if (message_object["message"] != "null") {
						model.send_message("chat_message", message_object);
					}
					announced = true;
				}
            break;
        default: /* do nothing */ break;
    }
};

handlers.celestial_data = function (payload) {
	localStorage.removeItem("monobattles_selection")
	localStorage.removeItem("monobattles_name")
    model.systemName(payload.name);


    if (payload.planets.length)
        model.startingPlanetBiome(payload.planets[0].biome);

    if (payload.planets && payload.planets.length) {
        var previous = _.clone(model.celestialViewModels());
        model.celestialViewModels.removeAll();

        _.forEach(payload.planets, function (element, index) {
            model.celestialViewModels.push(new CelestialViewModel(element, previous[index]));
        });

        model.celestialViewModels.push(new CelestialViewModel({ isSun: true, index: payload.planets.length }));
    }

    if (model.celestialControlModel.needsReset())
        model.celestialControlModel.reset();

    model.maybePlayStartingMusic(); // starting music depends on planet data
}