import type { useMapSearch } from '@/features/map/hooks/useMapSearch';
import type { LayerKey, MapTool } from '@/features/map/types';
import SidebarHeader from './SidebarHeader';
import SearchPanel from './SearchPanel';
import AboutPanel from './AboutPanel';
import LayerPanel from './LayerPanel';
import MeasurePanel from './MeasurePanel';

interface MapSidebarProps {
  search: ReturnType<typeof useMapSearch>;
  visible: Record<LayerKey, boolean>;
  onToggleLayer: (key: LayerKey) => void;
  activeTool: MapTool | null;
  onPickTool: (tool: MapTool) => void;
  onClearAll: () => void;
  isOpen: boolean;
  hidden: boolean;
  onHide: () => void;
}

// Panel kiri: laci geser di HP/tablet, panel tetap di desktop yang bisa disembunyikan ke kiri.
export default function MapSidebar({ search, visible, onToggleLayer, activeTool, onPickTool, onClearAll, isOpen, hidden, onHide }: MapSidebarProps) {
  return (
    <div data-tour="sidebar" className={`absolute top-0 left-0 bottom-0 z-30 flex flex-col w-[300px] max-w-[88vw] p-3 sm:top-4 sm:left-4 sm:bottom-4 sm:p-0 sm:w-[320px] sm:max-w-none transition-transform duration-300 ease-in-out ${hidden ? '' : 'lg:translate-x-0'} ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
        <SidebarHeader onHide={onHide} />
        <SearchPanel search={search} />
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          <AboutPanel />
          <LayerPanel visible={visible} onToggle={onToggleLayer} />
          <MeasurePanel activeTool={activeTool} onPickTool={onPickTool} onClearAll={onClearAll} />
        </div>
      </div>
    </div>
  );
}
