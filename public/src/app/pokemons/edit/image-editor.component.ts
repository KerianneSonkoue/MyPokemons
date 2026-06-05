import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  imports: [FormsModule]
})
export class ImageEditorComponent implements AfterViewInit {
  @Input() imageUrl = '';
  @Output() imageChanged = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('previewImg') previewRef!: ElementRef<HTMLImageElement>;

  brightness = 100;
  contrast = 100;
  saturation = 100;
  blur = 0;
  activeFilter = 'none';

  cropMode = false;
  cropRect = { x: 0, y: 0, w: 0, h: 0 };
  corsError = false;

  private dragging = false;
  private startX = 0;
  private startY = 0;

  currentSrc = '';

  readonly presetFilters = [
    { label: 'Aucun',    value: 'none',      css: '' },
    { label: 'N & B',    value: 'grayscale',  css: 'grayscale(100%)' },
    { label: 'Sépia',    value: 'sepia',      css: 'sepia(100%)' },
    { label: 'Vintage',  value: 'vintage',    css: 'sepia(60%) contrast(110%) brightness(85%)' },
    { label: 'Manga',    value: 'manga',      css: 'grayscale(100%) contrast(250%) brightness(115%)' },
    { label: 'Froid',    value: 'cold',       css: 'hue-rotate(200deg) saturate(130%)' },
    { label: 'Chaud',    value: 'warm',       css: 'hue-rotate(-20deg) saturate(160%)' },
  ];

  ngAfterViewInit(): void {
    this.currentSrc = this.imageUrl;
  }

  get cssFilter(): string {
    const base = `brightness(${this.brightness}%) contrast(${this.contrast}%) saturate(${this.saturation}%) blur(${this.blur}px)`;
    const preset = this.presetFilters.find(f => f.value === this.activeFilter)?.css || '';
    return preset ? `${base} ${preset}` : base;
  }

  startCrop(): void {
    this.cropMode = true;
    this.cropRect = { x: 0, y: 0, w: 0, h: 0 };
  }

  cancelCrop(): void {
    this.cropMode = false;
  }

  onMouseDown(e: MouseEvent): void {
    if (!this.cropMode) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    this.dragging = true;
    this.cropRect = { x: this.startX, y: this.startY, w: 0, h: 0 };
    e.preventDefault();
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.dragging || !this.cropMode) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.cropRect = {
      x: Math.min(x, this.startX),
      y: Math.min(y, this.startY),
      w: Math.abs(x - this.startX),
      h: Math.abs(y - this.startY)
    };
  }

  onMouseUp(): void {
    this.dragging = false;
  }

  applyCrop(): void {
    if (this.cropRect.w < 10 || this.cropRect.h < 10) return;

    const img = this.previewRef.nativeElement;
    const imgRect = img.getBoundingClientRect();
    const containerRect = img.parentElement!.getBoundingClientRect();

    const offsetX = imgRect.left - containerRect.left;
    const offsetY = imgRect.top - containerRect.top;

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const srcX = Math.round((this.cropRect.x - offsetX) * scaleX);
    const srcY = Math.round((this.cropRect.y - offsetY) * scaleY);
    const srcW = Math.max(1, Math.round(this.cropRect.w * scaleX));
    const srcH = Math.max(1, Math.round(this.cropRect.h * scaleY));

    const canvas = document.createElement('canvas');
    canvas.width = srcW;
    canvas.height = srcH;
    const ctx = canvas.getContext('2d')!;

    try {
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
      this.currentSrc = canvas.toDataURL('image/png');
      this.corsError = false;
    } catch {
      this.corsError = true;
    }
    this.cropMode = false;
  }

  applyAndClose(): void {
    const img = this.previewRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.clientWidth;
    canvas.height = img.naturalHeight || img.clientHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = this.cssFilter;

    try {
      ctx.drawImage(img, 0, 0);
      this.imageChanged.emit(canvas.toDataURL('image/png'));
    } catch {
      this.imageChanged.emit(this.currentSrc || this.imageUrl);
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
