"use client"
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Camera, X, ArrowRight, Info, AlertCircle } from "lucide-react";
import Button from "@/core-components/Button";
import ImageUploading from "react-images-uploading";
import { cn } from "@/utils/cn";

export default function ScheduleStep({ data, onUpdate, onNext, onBack }) {
  const [date, setDate] = useState(
    data.date ? new Date(data.date).toISOString().split("T")[0] : ""
  );
  const [time, setTime] = useState(
    data.time
      ? new Date(data.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      : ""
  );
  const [receiptImage, setReceiptImage] = useState(
    data.deliverydetails?.receiptImage ? [data.deliverydetails.receiptImage] : []
  );

  const today = new Date().toISOString().split("T")[0];
  const canProceed = !!date && !!time;

  const handleNext = () => {
    if (!canProceed) return;

    const dateTimestamp = Date.parse(date);
    const [hours, minutes] = time.split(":");
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const timeTimestamp = timeDate.getTime();

    onUpdate({
      date: dateTimestamp,
      time: timeTimestamp,
      deliverydetails: {
        ...data.deliverydetails,
        receiptImage: receiptImage.length > 0 ? receiptImage[0] : null,
      },
    });
    onNext();
  };

  return (
    <div className="p-6 space-y-8">

      {/* Date + Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarIcon size={12} className="text-primary" /> Pickup Date
          </label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-gray-700 cursor-pointer"
          />
        </div>

        {/* Time */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={12} className="text-secondary" /> Preferred Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-gray-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-3.5 bg-blue-50 rounded-xl border border-blue-100">
        <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-600 leading-relaxed">
          We recommend scheduling at least 24 hours in advance for best availability.
          Same-day bookings may be subject to a premium.
        </p>
      </div>

      {/* Receipt upload (optional) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Camera size={15} className="text-gray-400" /> Store Receipt
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Required for retail pickups (IKEA, Home Depot, etc.)</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400 px-2 py-1 rounded-md">
            Optional
          </span>
        </div>

        <ImageUploading
          value={receiptImage}
          onChange={(list) => setReceiptImage(list)}
          maxNumber={1}
          dataURLKey="data_url"
        >
          {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
            <div>
              {imageList.length === 0 ? (
                <button
                  onClick={onImageUpload}
                  {...dragProps}
                  className={cn(
                    "w-full py-10 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-gray-50"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                    <Camera size={18} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-600">Click or drag to upload</p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or WEBP</p>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 group aspect-video bg-gray-50">
                  <img
                    src={imageList[0]["data_url"]}
                    alt="Receipt"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => onImageRemove(0)}
                      className="p-2 bg-white rounded-xl text-red-500 hover:scale-105 transition-transform shadow-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </ImageUploading>
      </div>

      {/* Validation hint */}
      {!canProceed && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
          <AlertCircle size={14} className="text-orange-400 flex-shrink-0" />
          <p className="text-xs font-medium text-orange-600">Please select a date and time to continue.</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNext} disabled={!canProceed} className="group rounded-full">
          Review Order
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
