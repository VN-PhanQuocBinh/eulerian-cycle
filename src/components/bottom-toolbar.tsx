import FloatintPrimaryControl from "./primary-control-bar/floating-primary-control";
import CollapsedBottomPanel from "./primary-control-bar/collapsed-bottom-panel";

function BottomToolbar() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
      <FloatintPrimaryControl />
      <CollapsedBottomPanel />
    </div>
  );
}

export default BottomToolbar;
