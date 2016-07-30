define([], function () {
    var control = angular.module('pnControls',[]);

    control.value('SelectDefaults', {
		displayText: 'انتخاب کنید ...',
		emptyListText: 'هیچ آیتمی برای نمایش وجود ندارد.',
		emptySearchResultText: 'هیچ آیتمی وجود ندارد "$0"',
		searchDelay: 300
	});

    return control;
});