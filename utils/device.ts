import { isElectron } from 'lib/helpers/electron';

type DeviceInfoType = {
    platform: Platform;
};

enum Platform {
    Web = 'WEB',
    Desktop = 'DESKTOP',
}

export const getDeviceInfo = (): DeviceInfoType => {
    if (isElectron()) {
        return { platform: Platform.Desktop };
    }

    return { platform: Platform.Web };
};
