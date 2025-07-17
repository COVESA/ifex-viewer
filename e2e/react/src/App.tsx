import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { specificationItemMock } from '../../../src/tests/mocks/specification.ts';
import '../../../dist/ifex-viewer.es';
import { ClipboardCopiedEvent, IfexSpecificationItem } from '../../../src/types.ts';
import '../../e2e-app.css';
import { fleetSizeMethodSlotContent, fleetSizeMethodSlotPath, headlineSlotPath, headlineSlotText, initialNodePathQueryName, slotQueryName } from '../../e2e-apps-setup.ts';

function App() {
  const ifexViewerRef = useRef(null);
  const specifications: IfexSpecificationItem[] = [specificationItemMock];
  const [specLoaded, setSpecLoaded] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState('');
  const [clipboardCopiedEventPayload, setClipboardCopiedEventPayload] = useState<ClipboardCopiedEvent | null>(null);
  const [hasSlots, setHasSlots] = useState(false);

  useEffect(() => {
    if (ifexViewerRef.current) {
      (ifexViewerRef.current as any).specifications = specifications;
    }
  }, [ifexViewerRef]);

  useLayoutEffect(() => {
    (ifexViewerRef.current as any).addEventListener('specloaded', () => setSpecLoaded(true));
  }, []);

  useEffect(() => {
    (ifexViewerRef.current as any).addEventListener('nodeselected', (evt: CustomEvent) => setSelectedNodePath(evt.detail[0].path));
    (ifexViewerRef.current as any).addEventListener('clipboardcopiedsuccessful', (evt: CustomEvent) => setClipboardCopiedEventPayload(evt.detail[0]));
  }, []);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const initialNodePath = queryParameters.get(initialNodePathQueryName);
    if (initialNodePath) {
      (ifexViewerRef.current as any).selectNode(initialNodePath);
    }
    const hasSlots = queryParameters.get(slotQueryName);
    if (hasSlots) {
      setHasSlots(hasSlots === 'true');
    }
  }, []);

  return (
    <div>
      <div className="container">Spec loaded: {String(specLoaded)}</div>

      <div className="container">Selected node: {selectedNodePath}</div>

      <div className="container">
        Copied event data: <br />
        <span>Type: {clipboardCopiedEventPayload?.type ?? ''} </span>
        <br />
        <span>Data: {clipboardCopiedEventPayload?.data ?? ''} </span>
      </div>

      <ifex-viewer ref={ifexViewerRef}>
        {hasSlots && (
          <>
            <div slot={headlineSlotPath}>{headlineSlotText}</div>
            <div slot={fleetSizeMethodSlotPath}>{fleetSizeMethodSlotContent}</div>
          </>
        )}
      </ifex-viewer>
    </div>
  );
}

export default App;
