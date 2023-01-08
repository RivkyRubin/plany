import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private adminService:AdminService,
    private toaster: ToasterService,) { }

  ngOnInit(): void {
  }
  updateDatabase()
  {
this.adminService.updateDatabase().subscribe({next:(val)=>{
if(val == true)
this.toaster.success("Updated Successfully!");
else this.toaster.error("Update failed");
}});
  }
}
