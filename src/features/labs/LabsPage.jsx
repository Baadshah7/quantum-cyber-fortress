import LabsCatalog from '@/features/gate/components/LabsCatalog/LabsCatalog';

export default function LabsPage() {
  return (
    <div className="flex-1 flex flex-col pb-12">
      <LabsCatalog isPage={true} />
    </div>
  );
}
