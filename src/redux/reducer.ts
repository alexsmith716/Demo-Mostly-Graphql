import { reducer as device, State as DeviceState } from './modules/device';
import { reducer as info, State as InfoState } from './modules/info';
import { reducer as infoAlert, State as InfoAlertState } from './modules/infoAlert';
import { reducer as infoAlertThree, State as InfoAlertThreeState } from './modules/infoAlertThree';
import { reducer as theme, State as ThemeState } from './modules/theme';

export function rootReducer()  {
	return {
		online: (v = true) => v,
		device,
		info,
		infoAlert,
		infoAlertThree,
		theme,
	};
}
