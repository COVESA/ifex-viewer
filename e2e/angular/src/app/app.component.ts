import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewChild } from '@angular/core';
import { specificationItemMock } from '../../../../src/tests/mocks/specification';
import { ClipboardCopiedEvent } from '../../../../src/types';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { fleetSizeMethodSlotContent, fleetSizeMethodSlotPath, headlineSlotPath, headlineSlotText, initialNodePathQueryName, slotQueryName } from '../../../e2e-apps-setup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['../../../e2e-app.css'],
  imports: [CommonModule],
  standalone: true,
})
export class AppComponent {
  @ViewChild('ifexViewer') ifexViewer: any;

  specifications = signal([specificationItemMock]);
  selectedNodePath = signal('');
  specLoaded = signal(false);
  clipboardCopiedEventPayload = signal<ClipboardCopiedEvent | null>(null);

  private readonly route = inject(ActivatedRoute);

  hasSlots$ = this.route.queryParams.pipe(switchMap(params => of(params[slotQueryName] === 'true')));

  // Test data imports
  protected readonly headlineSlotText = headlineSlotText;
  protected readonly headlineSlotPath = headlineSlotPath;
  protected readonly fleetSizeMethodSlotPath = fleetSizeMethodSlotPath;
  protected readonly fleetSizeMethodSlotContent = fleetSizeMethodSlotContent;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const initialNodePath = params[initialNodePathQueryName];
      if (params[initialNodePathQueryName]) {
        this.ifexViewer.nativeElement.selectNode(initialNodePath);
      }
    });
  }

  onNodeSelected(evt: Event) {
    this.selectedNodePath.set((evt as CustomEvent).detail[0].path);
  }

  onSpecLoaded() {
    this.specLoaded.set(true);
  }

  onClipboardCopied(evt: Event) {
    this.clipboardCopiedEventPayload.set((evt as CustomEvent).detail[0]);
  }
}
