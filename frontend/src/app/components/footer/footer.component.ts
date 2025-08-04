import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2025 Your Bank. All rights reserved.</p>
        <div class="mt-4 space-x-4">
          <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}