import { Injectable } from '@angular/core';
import { Audit } from '../model/audit';
import { FileStore } from '../model/FileStore';
import { Headers, RequestOptions, Http} from '@angular/http';
declare var amplify: any;



// Don't forget the parentheses! Neglecting them leads to an error that's difficult to diagnose.
@Injectable()
export class AuditService {

  headers: Headers;
  options: RequestOptions;
  // constructor(private growthUpdateService: GrowthUpdateService) {
  //
  // }

  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  insertAudit(audit: Audit) {
    audit.originalImages = [];
    let body = JSON.stringify({
      'audit': audit
    });
    return this.http.post('/insert', body, this.options)
      .map(res => res.json());
  }

  uplaod(files: Array<File>) {
    return new Promise((resolve, reject) => {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      for (let i = 0; i < files.length; i++) {
        formData.append('uploads[]', files[i], files[i].name);
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', '/upload', true);
      xhr.send(formData);
    });

  }

  download(file: FileStore) {
    let body = JSON.stringify({
      'name': file.name,
      'attachmentname': file.attachmentname
    });
    return this.http.post('/download', body, this.options);
  }

  queryAudits() {
    let body = JSON.stringify({});
    return this.http.post('/query', body, this.options)
      .map(res => res.json());
  }


  getAudits() {
    // console.log('audits' + amplify.store('audits'));
    let audits: Audit[] = JSON.parse(amplify.store('audits') === undefined ? null : amplify.store('audits'));
    console.log('audits');
    // console.log(audits);
    if (audits === null || audits.length < 1) {
      console.log('Get from mock audits array');
      audits = [];
      amplify.store('audits', JSON.stringify(audits));
    }
    return Promise.resolve(audits);
  }

  getAudit(crn: string) {
    return this.getAudits().then(audits => {
      for (let c of audits) {
        if (c.crn === crn) {
          return Promise.resolve(c);
        }
      }
    });
  }

  updateAudit(audit: Audit) {
    console.log('updateAudit');
    return this.getAudits().then(audits => {
      console.log('audits');
      // console.log(audits);
      let current: Audit[] = audits;
      let newList: Audit[] = [];
      for (let c of current) {
        if (c.crn !== audit.crn) {
          newList.push(c);
        }
      }
      newList.push(audit);
      console.log('newList');
      // console.log(newList);
      amplify.store('audits', JSON.stringify(newList));

      return Promise.resolve(newList);
    });
  }

  removeAudit(audit: Audit) {
    console.log('removeAudit');
    return this.getAudits().then(audits => {
      let index = -1;
      for (let b of audits) {
        if (b.crn === audit.crn) {
          index = audits.indexOf(b, 0);
          break;
        }
      }
      if (index > -1) {
        audits.splice(index, 1);
      }
      amplify.store('audits', JSON.stringify(audits));
      return Promise.resolve(audits);
    });
  }


  clear() {
    amplify.store('audits', null);
  }
}
