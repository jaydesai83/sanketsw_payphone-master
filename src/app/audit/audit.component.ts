import {Component, OnInit, ElementRef} from '@angular/core';
import {Button, InputText, Checkbox, TabView, TabPanel, Panel, DataGrid,
  Calendar, DataTable, Column, Menubar, MenuItem, UIChart, SelectButton,
  SelectItem, Rating, InputTextarea
} from 'primeng/primeng';
import {Router} from '@angular/router';
import { AuditService } from '../services/audit.service';
import { Audit } from '../model/Audit';
import { FileStore } from '../model/FileStore';
import { User } from '../model/user';
declare var amplify: any;



@Component({
  selector: 'as-audit',
  templateUrl: 'app/audit/audit.html',
  styleUrls: [
    'app/audit/audit.css'
  ],
  directives: [Button, InputText, Checkbox, TabView, SelectButton, Rating,
    UIChart, TabPanel, Panel, DataGrid, Calendar, DataTable, Column, Menubar,
    InputTextarea],
  providers: [AuditService]
})

export class AuditComponent implements OnInit {

  items: MenuItem[];
  globalItems: MenuItem[];
  entityItems: MenuItem[];

  audits: Audit[];

  selectedAudit: Audit;

  user: User;

  selectedFile: FileStore;

  yesno: SelectItem[];

  history: Audit[];

  options: any;

  constructor(private router: Router, private auditService: AuditService, private element: ElementRef) {
    // amplify.store('loggedIn', 'false');
    this.yesno = [];
    this.yesno.push({ label: 'Yes', value: 'Yes' });
    this.yesno.push({ label: 'No', value: 'No' });
  }

  updateHistory() {
    this.history = [];
    console.log('querying recent history');
    this.auditService.queryAudits().subscribe(resfd => {
      if (resfd) {
        console.log(resfd);
        for (let e of resfd) {
          this.history.push(e.doc);
        }
      }
      console.log('printing history');
      console.log(this.history);
    });
  }

  ngOnInit() {
    this.globalItems = [
      /* { label: 'Home', icon: 'fa-home', command: (event) => { this.searchAudit(); } }, */
      { label: 'New', icon: 'fa-plus', command: (event) => { this.newAudit(); } }
    ];
    this.entityItems = [
      { label: 'Save', icon: 'fa-save', command: (event) => { this.saveAudit(); } },
      { label: 'Cancel', icon: 'fa-chevron-left', command: (event) => { this.clearAudit(); } }
      // { label: 'Delete', icon: 'fa-trash', command: (event) => { this.removeAudit(this.selectedAudit); } }
    ];
    this.refreshMenuBar();
    this.user = JSON.parse(amplify.store('loggedUser'));
    this.auditService.getAudits().then(audits => {
      this.audits = audits;
    });

    this.updateHistory();
  }

  checkNoofFiles() {
    if (this.selectedAudit && this.selectedAudit.files.length > 1) {
      return true;
    }
    return false;
  }

  uploadButtonClick() {
    document.getElementById('upload').click();
  }

  photoSelected(e) {
    console.log('photo selected');
    let file1: File = e.target.files[0];
    console.log(file1);
    this.selectedAudit.originalImages.push(file1);
    console.log('saved the original image. adding thumbnail...');
    this.selectedFile = { name: file1.name, size: file1.size, type: file1.type };
    this.displayFile(file1);
    this.selectedAudit.files.push(this.selectedFile);
  }

  displayFile(file1: File, resize = true) {
    let img = document.createElement('img');
    img.src = window.URL.createObjectURL(file1);
    console.log(file1);
    console.log(this.selectedFile);
    // Create a FileReader
    let reader: any;
    reader = new FileReader();

    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener('load', (event) => {
      // Get the event.target.result from the reader (base64 of the image)
      img.src = event.target.result;

      // Resize the image
      let resized_img = img.src;
      if (resize) { resized_img = this.resize(img); }
      // Push the img src (base64 string) into our array that we display in our html template
      this.selectedFile.src = resized_img;
    }, false);

    reader.readAsDataURL(file1);
  }

  resize(img: any, MAX_WIDTH = 100, MAX_HEIGHT = 100) {

    let canvas = document.createElement('canvas');

    console.log('Size Before: ' + img.src.length + ' bytes');

    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, width, height);

    let dataUrl = canvas.toDataURL('image/jpeg');
    // IMPORTANT: 'jpeg' NOT 'jpg'
    console.log('Size After:  ' + dataUrl.length + ' bytes');
    return dataUrl;
  }

  showFile(file1: File) {
    let img = document.createElement('img');
    img.src = window.URL.createObjectURL(file1);
    // Create a FileReader
    let reader: any;
    reader = new FileReader();

    // Add an event listener to deal with the file when the reader is complete
    reader.addEventListener('load', (event) => {
      // Get the event.target.result from the reader (base64 of the image)
      img.src = event.target.result;

      // Push the img src (base64 string) into our array that we display in our html template
      window.open(img.src);
    }, false);

    reader.readAsDataURL(file1);
  }


  downloadFile(file1: FileStore) {
    if (!file1.attachmentname) {
      console.log('file1.name=' + file1.name);
      for (let c of this.selectedAudit.originalImages) {
        console.log(c.name);
        if (file1.name === c.name) {
          console.log('matched');
          this.showFile(c);
          break;
        }
      }
    } else {
      console.log('opening image ' + file1.attachmentname);
      this.auditService.download(file1).subscribe(
        (data: any) => {
          console.log('got the image...');
          window.open('data:image/jpeg;base64,' + data._body);
        },
        error => console.log('Error downloading the file. ' + error),
        () => console.log('Completed file download.'));
    }
  }

  refreshMenuBar() {
    this.items = [];
    this.items = this.globalItems;
    console.log('items');
    console.log(this.items);
    if (this.selectedAudit) {
      this.items = this.entityItems; // this.items.concat(this.entityItems);
    }
  }

  newAudit() {
    this.selectedAudit = { 'crn': '' };
    this.selectedAudit.files = [];
    this.selectedAudit.originalImages = [];
    this.refreshMenuBar();
    // TODO show form
  }

  searchAudit() {
    this.selectedAudit = null;
    this.refreshMenuBar();
  }

  saveAudit() {
    this.auditService.updateAudit(this.selectedAudit).then(audits => {
      this.audits = audits;
      this.selectedAudit = null;
      this.refreshMenuBar();
    });
    // TODO Growl saved
  }

  clearAudit() {
    this.selectedAudit = null;
    this.auditService.getAudits().then(audits => {
      this.audits = audits;
    });
    this.refreshMenuBar();
  }

  editAudit(entry: Audit) {
    this.selectedAudit = entry;
    this.selectedFile = null;
    this.refreshMenuBar();
  }

  removeAudit(entry: Audit) {
    this.auditService.removeAudit(entry).then(audits => {
      this.audits = audits;
    });
    this.selectedAudit = null;
    this.refreshMenuBar();
  }

  // Composite Relationship

  newFile() {
    this.selectedFile = {};
    this.selectedAudit.files.push(this.selectedFile);
    // TODO show form
  }

  searchFile() {
    this.selectedFile = null;
    // TODO show form
  }

  editFile(entry: FileStore) {
    this.selectedFile = entry;
  }

  removeFile(entry: FileStore) {
    console.log(entry);
    let index = this.selectedAudit.files.indexOf(entry, 0);
    if (index > -1) {
      this.selectedAudit.files.splice(index, 1);
    }
  }

  syncAudit(entry: Audit) {
    console.log('uploading images to the cloud');
    console.log(entry.originalImages);
    this.auditService.uplaod(entry.originalImages).then(
      (result: any) => {
        console.log(result);
        for (let c of entry.files) {
          for (let r of result) {
            if (c.name === r.originalname) {
              c.attachmentname = r.filename;
            }
          }
        }

        console.log('inserting entry to database in the cloud');
        this.auditService.insertAudit(entry).subscribe(resito => {
          console.log('entry inserted.');
          this.removeAudit(entry);
          this.updateHistory();
        });
      }, (error) => {
        console.error(error);
      });
  }


}
