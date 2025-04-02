import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  showSidebar = true;
  @Output() closeSidebar = new EventEmitter<void>();



  constructor(
    private authService: AuthService,
  ) {}

  onClose() {
    this.closeSidebar.emit();
  }
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  logout():void{
    this.authService.logout();
  }

}
