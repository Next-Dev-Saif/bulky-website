"use client";
import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Camera,
  X,
  Package,
  Search,
  Check,
  Pencil,
} from "lucide-react";
import ImageUploading from "react-images-uploading";
import Button from "@/core-components/Button";
import {
  ItemData,
  BedSubTypes,
  BedMoreInfo,
  AppliancesSubTypes,
  AppliancesSizeOptions,
  TVSubTypes,
  BoatsSubTypes,
  BoatsHitchBallSizes,
  MotorcycleSubTypes,
  ConstructionSubTypes,
} from "@/utils/booking-data";
import { cn } from "@/utils/cn";

// ─── Icon map (Lucide) — closest visual matches to mobile app item cards ───────
import {
  BedDouble,
  Bike,
  Anchor,
  Tv,
  HardHat,
  WashingMachine,
  Package as BoxIcon,
} from "lucide-react";

const ITEM_ICONS = {
  Bed: BedDouble,
  Bike: Bike,
  Boxes: BoxIcon,
  Boats: Anchor,
  Motorcycle: Bike,
  TV: Tv,
  Construction: HardHat,
  Appliances: WashingMachine,
};

// Unique color theme per category — only the icon gets the unique color
const ITEM_COLORS = {
  Bed: {
    icon: "text-violet-500",
    border: "hover:border-violet-200",
    shadow: "hover:shadow-violet-50/80",
    label: "Mattresses, frames & more",
  },
  Bike: {
    icon: "text-emerald-500",
    border: "hover:border-emerald-200",
    shadow: "hover:shadow-emerald-50/80",
    label: "Bicycles of all sizes",
  },
  Boxes: {
    icon: "text-amber-500",
    border: "hover:border-amber-200",
    shadow: "hover:shadow-amber-50/80",
    label: "Cardboard boxes & crates",
  },
  Boats: {
    icon: "text-sky-500",
    border: "hover:border-sky-200",
    shadow: "hover:shadow-sky-50/80",
    label: "Up to 60 ft watercraft",
  },
  Motorcycle: {
    icon: "text-rose-500",
    border: "hover:border-rose-200",
    shadow: "hover:shadow-rose-50/80",
    label: "Motorcycles, ATVs, carts",
  },
  TV: {
    icon: "text-indigo-500",
    border: "hover:border-indigo-200",
    shadow: "hover:shadow-indigo-50/80",
    label: 'Up to 100" flat screens',
  },
  Construction: {
    icon: "text-orange-500",
    border: "hover:border-orange-200",
    shadow: "hover:shadow-orange-50/80",
    label: "Materials, lumber & more",
  },
  Appliances: {
    icon: "text-teal-500",
    border: "hover:border-teal-200",
    shadow: "hover:shadow-teal-50/80",
    label: "Fridges, washers & more",
  },
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function RadioRow({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all text-left mb-3",
        active
          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
      )}
    >
      <span className="text-sm font-bold text-gray-800">{label}</span>
      <span
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
          active ? "border-primary bg-primary" : "border-gray-300",
        )}
      >
        {active && <span className="w-2 h-2 bg-white rounded-full" />}
      </span>
    </button>
  );
}

function ToggleChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
        active
          ? "bg-primary/10 border-primary text-primary"
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300",
      )}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }) {
  return <p className="text-sm font-bold text-gray-800 mb-3">{children}</p>;
}

// ─── Per-type detail panels ───────────────────────────────────────────────────

function BedDetail({ item, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Select Bed Type</SectionLabel>
        {BedSubTypes.map((opt) => (
          <RadioRow
            key={opt.id}
            label={`${opt.title} — ~${opt.weight} lbs`}
            active={item.selectedItem?.id === opt.id}
            onClick={() => onChange({ ...item, selectedItem: opt })}
          />
        ))}
      </div>
      <div>
        <SectionLabel>Add More Details</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {BedMoreInfo.map((opt) => (
            <ToggleChip
              key={opt}
              label={opt}
              active={item.moreInfo?.includes(opt)}
              onClick={() => {
                const cur = item.moreInfo || [];
                onChange({
                  ...item,
                  moreInfo: cur.includes(opt)
                    ? cur.filter((o) => o !== opt)
                    : [...cur, opt],
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppliancesDetail({ item, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Appliance Type</SectionLabel>
        {AppliancesSubTypes.map((opt) => (
          <RadioRow
            key={opt.id}
            label={`${opt.title} — ~${opt.weight} lbs`}
            active={item.selectedItem?.id === opt.id}
            onClick={() => onChange({ ...item, selectedItem: opt })}
          />
        ))}
      </div>
      <div>
        <SectionLabel>Size</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {AppliancesSizeOptions.map((s) => (
            <ToggleChip
              key={s}
              label={s}
              active={item.size === s}
              onClick={() => onChange({ ...item, size: s })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TVDetail({ item, onChange }) {
  return (
    <div>
      <SectionLabel>TV Size</SectionLabel>
      {TVSubTypes.map((opt) => (
        <RadioRow
          key={opt.id}
          label={opt.label}
          active={item.selectedItem?.id === opt.id}
          onClick={() =>
            onChange({
              ...item,
              selectedItem: { ...opt, title: opt.label, weight: opt.weight },
            })
          }
        />
      ))}
    </div>
  );
}

function BoatsDetail({ item, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Boat Length</SectionLabel>
        {BoatsSubTypes.map((opt) => (
          <RadioRow
            key={opt.id}
            label={opt.label}
            active={item.selectedItem?.id === opt.id}
            onClick={() =>
              onChange({
                ...item,
                selectedItem: { ...opt, title: opt.label, weight: opt.weight },
              })
            }
          />
        ))}
      </div>
      <div>
        <SectionLabel>Hitch Ball Size</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {BoatsHitchBallSizes.map((s) => (
            <ToggleChip
              key={s}
              label={s}
              active={item.moreInfo?.includes(s)}
              onClick={() => {
                const cur = item.moreInfo || [];
                onChange({
                  ...item,
                  moreInfo: cur.includes(s)
                    ? cur.filter((o) => o !== s)
                    : [...cur, s],
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MotorcycleDetail({ item, onChange }) {
  return (
    <div>
      <SectionLabel>Vehicle Type</SectionLabel>
      {MotorcycleSubTypes.map((opt) => (
        <RadioRow
          key={opt.id}
          label={`${opt.label} — ~${opt.weight} lbs`}
          active={item.selectedItem?.id === opt.id}
          onClick={() =>
            onChange({
              ...item,
              selectedItem: { ...opt, title: opt.label, weight: opt.weight },
            })
          }
        />
      ))}
    </div>
  );
}

function ConstructionDetail({ item, onChange }) {
  return (
    <div>
      <SectionLabel>Item Type</SectionLabel>
      {ConstructionSubTypes.map((opt) => (
        <RadioRow
          key={opt.id}
          label={`${opt.label}`}
          active={item.selectedItem?.id === opt.id}
          onClick={() =>
            onChange({
              ...item,
              selectedItem: { ...opt, title: opt.label, weight: opt.weight },
            })
          }
        />
      ))}
    </div>
  );
}

function BikeDetail({ item, onChange }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
      <Bike size={24} className="text-primary flex-shrink-0" />
      <div>
        <p className="font-bold text-gray-800">Bike</p>
        <p className="text-xs text-gray-500">
          No additional details needed. Just confirm to add.
        </p>
      </div>
    </div>
  );
}

function BoxesDetail({ item, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Number of Boxes</SectionLabel>
        <input
          type="number"
          min="1"
          placeholder="e.g. 10"
          value={item.numberOfBoxes || ""}
          onChange={(e) =>
            onChange({
              ...item,
              numberOfBoxes: e.target.value,
              count: parseInt(e.target.value) || 1,
            })
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-semibold"
        />
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...item, isOversized: !item.isOversized })}
        className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-white w-full text-left hover:border-gray-300 transition-all"
      >
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
            item.isOversized ? "bg-primary border-primary" : "border-gray-300",
          )}
        >
          {item.isOversized && <Check size={12} className="text-white" />}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Oversized boxes</p>
          <p className="text-xs text-gray-400">
            (larger than 50-inch TV boxes, for example)
          </p>
        </div>
      </button>
    </div>
  );
}

// ─── Detail panel router ──────────────────────────────────────────────────────
function ItemDetailPanel({ item, onChange }) {
  switch (item.type) {
    case "Bed":
      return <BedDetail item={item} onChange={onChange} />;
    case "Appliances":
      return <AppliancesDetail item={item} onChange={onChange} />;
    case "TV":
      return <TVDetail item={item} onChange={onChange} />;
    case "Boats":
      return <BoatsDetail item={item} onChange={onChange} />;
    case "Motorcycle":
      return <MotorcycleDetail item={item} onChange={onChange} />;
    case "Construction":
      return <ConstructionDetail item={item} onChange={onChange} />;
    case "Bike":
      return <BikeDetail item={item} onChange={onChange} />;
    case "Boxes":
      return <BoxesDetail item={item} onChange={onChange} />;
    default:
      return null;
  }
}

// ─── Quantity stepper (used only for Bed + Appliances) ───────────────────────
function QuantityRow({ count, onDecrement, onIncrement }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
      <span className="font-bold text-gray-700 text-sm">Quantity</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onDecrement}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-xl">{count}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 font-bold text-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Validate before confirming ───────────────────────────────────────────────
function isItemValid(item) {
  if (item.type === "Bike") return true;
  if (item.type === "Boxes") return !!item.numberOfBoxes;
  return !!item.selectedItem;
}

// ─── Main Step ────────────────────────────────────────────────────────────────
export default function ItemsStep({ data, onUpdate, onNext, onBack }) {
  const [selectedItems, setSelectedItems] = useState(data.itemdetails || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const filteredCategories = useMemo(
    () =>
      ItemData.filter((cat) =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const handleAddCategory = (cat) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: cat.title,
      type: cat.type,
      selectedItem: null,
      count: 1,
      moreInfo: [],
      images: [],
    };
    // Bike has no detail screen — add directly
    if (cat.type === "Bike") {
      setSelectedItems((prev) => [
        ...prev,
        { ...newItem, selectedItem: { title: "Bike", weight: 30 } },
      ]);
      return;
    }
    setEditingItem(newItem);
  };

  const handleEditItem = (item) => setEditingItem({ ...item });

  const handleSaveItem = () => {
    if (!isItemValid(editingItem)) return;
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === editingItem.id);
      return exists
        ? prev.map((i) => (i.id === editingItem.id ? editingItem : i))
        : [...prev, editingItem];
    });
    setEditingItem(null);
  };

  const handleRemoveItem = (id) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));

  const handleNext = () => {
    if (selectedItems.length === 0) return;
    const totalWeight = selectedItems.reduce((acc, item) => {
      const w = item.selectedItem?.weight || item.weight || 0;
      return acc + w * item.count;
    }, 0);
    onUpdate({ itemdetails: selectedItems, totalWeight });
    onNext();
  };

  const ItemIcon = editingItem
    ? ITEM_ICONS[editingItem.type] || Package
    : Package;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Left: Category grid ── */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="What are you moving?"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Categories
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const Icon = ITEM_ICONS[cat.type] || Package;
              const colors = ITEM_COLORS[cat.type] || {
                icon: "text-gray-500",
                border: "hover:border-gray-200",
                shadow: "hover:shadow-gray-50",
                label: "",
              };
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleAddCategory(cat)}
                  className={cn(
                    "group flex flex-col items-start p-5 bg-white border-2 border-gray-100 rounded-2xl",
                    "transition-all duration-200 text-left hover:-translate-y-0.5 hover:shadow-xl",
                    colors.border,
                    colors.shadow,
                  )}
                >
                  {/* Icon — white bg, only icon itself colored */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110">
                    <Icon size={28} className={colors.icon} />
                  </div>

                  <span className="text-sm font-extrabold text-gray-800 leading-tight mb-1">
                    {cat.title}
                  </span>
                  <span className="text-[11px] text-gray-400 leading-snug">
                    {colors.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Selected items ── */}
        <div className="w-full md:w-80 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            Selected Items
            <span className="ml-auto text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {selectedItems.length}
            </span>
          </h3>

          <div className="bg-gray-50 rounded-2xl p-4 min-h-[200px] border border-dashed border-gray-300 space-y-3">
            {selectedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                <Package size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No items added yet</p>
              </div>
            ) : (
              selectedItems.map((item) => {
                const Icon = ITEM_ICONS[item.type] || Package;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {item.selectedItem?.title || item.title}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditItem(item)}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Item Detail Modal ── */}
      {editingItem && (
        <div className="fixed top-[-35px] left-0 w-screen h-screen z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/5 via-white to-blue-50/60 border-b border-gray-100 px-7 py-6 flex-shrink-0">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary/70 to-primary/20 rounded-t-3xl" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary">
                    <ItemIcon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {editingItem.title} Details
                    </h2>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                      Select type & add details
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Per-type detail panel */}
              <ItemDetailPanel item={editingItem} onChange={setEditingItem} />

              {/* Quantity stepper (Bed & Appliances allow qty > 1) */}
              {(editingItem.type === "Bed" ||
                editingItem.type === "Appliances") && (
                <QuantityRow
                  count={editingItem.count}
                  onDecrement={() =>
                    setEditingItem((v) => ({
                      ...v,
                      count: Math.max(1, v.count - 1),
                    }))
                  }
                  onIncrement={() =>
                    setEditingItem((v) => ({ ...v, count: v.count + 1 }))
                  }
                />
              )}

              {/* Image upload */}
              <div className="space-y-3">
                <SectionLabel>
                  <span className="flex items-center gap-2">
                    <Camera size={15} /> Add Pictures (Max 3)
                  </span>
                </SectionLabel>
                <ImageUploading
                  multiple
                  value={editingItem.images}
                  onChange={(imgs) =>
                    setEditingItem((v) => ({ ...v, images: imgs }))
                  }
                  maxNumber={3}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={cn(
                          "w-20 h-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all",
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 text-gray-400 hover:border-gray-300",
                        )}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <Plus size={18} />
                        <span className="text-[10px] mt-1 font-bold">Add</span>
                      </button>
                      {imageList.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded-2xl overflow-hidden group"
                        >
                          <img
                            src={image["data_url"]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => onImageRemove(index)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={handleSaveItem}
                disabled={!isItemValid(editingItem)}
              >
                Confirm Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer actions ── */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedItems.length === 0}
          className="px-10 rounded-full"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
