import { MapPin, Phone, MessageSquare } from 'lucide-react';

interface Contact {
  name: string;
  phone: string;
  initial: string;
  color: string;
  badge?: string;
}

interface EmergencyContactCardProps {
  contact: Contact;
  onCall?: () => void;
  onMessage?: () => void;
}

export function EmergencyContactCard({ contact, onCall, onMessage }: EmergencyContactCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center text-white font-semibold text-lg`}
        >
          {contact.initial}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{contact.name}</p>
            {contact.badge && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {contact.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{contact.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCall}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm border border-gray-200"
        >
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onMessage}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm border border-gray-200"
        >
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
