import { SoftwareConnectDetails } from "../../storage/postgres/software-info.schema";
import { SOFTWARE_CONNECT_PROVIDER } from "../../utils/constants";

export const softwareInfoProviders = [
  {
    provide: SOFTWARE_CONNECT_PROVIDER,
    useValue: SoftwareConnectDetails,
  },
]
