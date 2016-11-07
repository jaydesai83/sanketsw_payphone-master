import { FileStore } from './FileStore';

export interface Audit {
  _id?: string;
  _rev?: string;
  crn?: string;
  name?: string;
  timestamp?: string;
  email?: string;

  CabinetLightWorking?: string;
  CabinetStructurallySound?: string;
  DialTonePresent?: string;
  HandsetGoodCondNotDamaged?: string;
  FollowOnButtonworking?: string;
  LcdDisplayWorkingCorrectly?: string;
  RefundChuteWorkingNoDamage?: string;
  AnyGrafittiOnPayPhone?: string;

  rating?: number;
  comment?: string;

  files?: FileStore[];

  originalImages?: File[];

}
