import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
import crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export interface Settings {
  homepageHeroTitle: string;
  homepageHeroSubtitle: string;
  homepageTeaserTitle: string;
  homepageTeaserSubtitle: string;
  homepageHeroImage?: string;
  homepageTeaserImage?: string;
}

export interface AboutSettings {
  historyText1: string;
  historyText2: string;
  historyImage?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  location: string;
  content: string;
  image?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

export interface VorstandItem {
  id: string;
  name: string;
  role: string;
  desc: string;
  type: string; // 'main' or 'extended'
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  url: string; // Bildpfad
  date: string;
  videoUrl?: string; // YouTube Link
}

export interface BauberichtUpdate {
  id: string;
  date: string;
  text: string;
  images?: string[];
}

export interface BauberichtItem {
  id: string;
  title: string;
  pilot: string;
  status: string;
  progress: number;
  date: string;
  desc?: string; // Legacy
  tech: string;
  pdfUrl?: string; // Optional PDF file
  images?: string[]; // Legacy
  updates?: BauberichtUpdate[];
}

export interface ArchiveDoc {
  id: string;
  title: string;
  date: string;
  type: string; // z.B. "PDF"
  url: string; // Pfad zur hochgeladenen Datei
}

export interface ArchiveMilestone {
  id: string;
  year: string;
  text: string;
}

export interface InternalDoc {
  id: string;
  title: string;
  url: string;
  date: string;
  uploadedBy: string; // Member name
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface InfoSafetyRule {
  id: string;
  title: string;
  desc: string;
  icon: string; // 'Shield', 'Users', 'Radio', 'AlertTriangle'
}

export interface InfoDocItem {
  id: string;
  title: string;
  url: string;
  sizeInfo: string;
}

export interface InfoSettings {
  safetyRules: InfoSafetyRule[];
  guestRules: string;
  guestWarning: string;
  docs: InfoDocItem[];
}

export interface MemberItem {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'board' | 'member';
  createdAt: string;
  profileImage?: string;
  phone?: string;
}

export interface PushSubscriptionItem {
  id: string; // Subscription ID
  userId: string;
  subscription: any; // Sub-Object from browser
}

export interface DbSchema {
  settings: Settings;
  about: AboutSettings;
  info: InfoSettings;
  news: NewsItem[];
  events: EventItem[];
  vorstand: VorstandItem[];
  gallery: GalleryItem[];
  bauberichte: BauberichtItem[];
  archiv_docs: ArchiveDoc[];
  archiv_milestones: ArchiveMilestone[];
  members: MemberItem[];
  internal_docs: InternalDoc[];
  messages: ContactMessage[];
  push_subscriptions: PushSubscriptionItem[];
}

const dbPath = path.join(process.cwd(), 'data.json');

export async function getDbData(): Promise<DbSchema> {
  try {
    const { data: rawData, error } = await supabase
      .from('app_data')
      .select('payload')
      .eq('id', 1)
      .maybeSingle();

    let data: DbSchema;

    if (error || !rawData || !rawData.payload || Object.keys(rawData.payload).length === 0) {
      console.log('No active data in Supabase, checking local migration fallback...');
      
      const dbPath = path.join(process.cwd(), 'data.json');
      if (fs.existsSync(dbPath)) {
        const fileContents = fs.readFileSync(dbPath, 'utf8');
        data = JSON.parse(fileContents) as DbSchema;
        
        // Push initial data to supabase
        console.log('Migrating local data to Supabase!');
        await supabase.from('app_data').update({ payload: data }).eq('id', 1);
      } else {
        data = createEmptyDb();
      }
    } else {
      data = rawData.payload as DbSchema;
    }
    
    // Ensure new schema keys exist for backward compatibility
    if (!data.about) data.about = { historyText1: "", historyText2: "", historyImage: "" };
    if (!data.info) data.info = { safetyRules: [], guestRules: "", guestWarning: "", docs: [] };
    if (!data.vorstand) data.vorstand = [];
    if (!data.events) data.events = [];
    if (!data.gallery) data.gallery = [];
    if (!data.archiv_docs) data.archiv_docs = [];
    if (!data.archiv_milestones) data.archiv_milestones = [];
    if (!data.members) data.members = [];
    
    if (!data.bauberichte) {
      data.bauberichte = [];
    } else {
      // Migrate legacy Bauberichte
      data.bauberichte.forEach((b) => {
        if (!b.updates) {
          b.updates = [];
          // If legacy desc exists, push it as the first update
          if (b.desc) {
            b.updates.push({
              id: Date.now().toString() + Math.random().toString(),
              date: b.date || new Date().toISOString().split('T')[0],
              text: b.desc,
              images: b.images || [],
            });
            // Don't delete desc immediately to avoid breaking if frontend updates aren't ready
          }
        }
      });
    }

    if (!data.internal_docs) data.internal_docs = [];
    if (!data.messages) data.messages = [];
    if (!data.push_subscriptions) data.push_subscriptions = [];
    
    return data;
  } catch (error) {
    console.error('Error reading Supabase DB:', error);
    return createEmptyDb();
  }
}

export async function saveDbData(data: DbSchema) {
  try {
    const { error } = await supabase.from('app_data').update({ payload: data }).eq('id', 1);
    if (error) {
      console.error('Supabase write error:', error);
    }
  } catch (error) {
    console.error('Error writing DB data:', error);
  }
}

function createEmptyDb(): DbSchema {
    return {
      settings: {
        homepageHeroTitle: "",
        homepageHeroSubtitle: "",
        homepageTeaserTitle: "",
        homepageTeaserSubtitle: ""
      },
      about: {
        historyText1: "",
        historyText2: "",
        historyImage: "",
      },
      info: {
        safetyRules: [],
        guestRules: "",
        guestWarning: "",
        docs: []
      },
      news: [],
      events: [],
      vorstand: [],
      gallery: [],
      bauberichte: [],
      archiv_docs: [],
      archiv_milestones: [],
      members: [],
      internal_docs: [],
      messages: [],
      push_subscriptions: []
    };
}
