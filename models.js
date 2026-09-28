const mongoose = require('mongoose');

const ExtraFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, default: '' }
}, { _id: true });

const DatabaseEntrySchema = new mongoose.Schema({
  label: { type: String, default: '' },        // e.g. "main users db", "analytics db"
  provider: { type: String, default: '' },      // e.g. MongoDB Atlas, Firebase, Supabase
  type: { type: String, default: '' },          // e.g. Mongo, Postgres, Firestore, Realtime DB
  account_email: { type: String, default: '' },
  notes: { type: String, default: '' }          // cluster/instance name, where connection string lives (not the secret)
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  tech_stack: { type: String, default: '' },
  status: { type: String, default: 'planning' }, // planning | in_progress | deployed | broken | paused | archived
  priority: { type: String, default: 'medium' }, // low | medium | high
  tags: { type: String, default: '' },

  repo_url: { type: String, default: '' },
  repo_account: { type: String, default: '' },
  live_url: { type: String, default: '' },
  custom_domain: { type: String, default: '' },

  hosting_provider: { type: String, default: '' },
  hosting_account_email: { type: String, default: '' },
  hosting_account_label: { type: String, default: '' },
  hosting_service_name: { type: String, default: '' },
  hosting_plan: { type: String, default: '' },
  hosting_region: { type: String, default: '' },
  auto_deploy_branch: { type: String, default: '' },

  databases: { type: [DatabaseEntrySchema], default: [] },

  firebase_project_id: { type: String, default: '' },
  firebase_account_email: { type: String, default: '' },
  google_cloud_project_id: { type: String, default: '' },
  google_cloud_account_email: { type: String, default: '' },

  play_store_package_name: { type: String, default: '' },
  play_store_account_email: { type: String, default: '' },
  play_store_url: { type: String, default: '' },
  play_store_status: { type: String, default: '' },

  dns_provider: { type: String, default: '' },
  dns_account_email: { type: String, default: '' },

  env_vars_location: { type: String, default: '' },
  env_var_names: { type: String, default: '' },

  monitoring_provider: { type: String, default: '' },
  monitoring_account_email: { type: String, default: '' },

  last_deployed_at: { type: String, default: '' },
  notes: { type: String, default: '' },

  extra_fields: { type: [ExtraFieldSchema], default: [] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const AccountSchema = new mongoose.Schema({
  service: { type: String, required: true, trim: true }, // e.g. Render, Firebase, MongoDB Atlas
  email: { type: String, default: '' },
  label: { type: String, default: '' }, // e.g. "personal", "college", "client-X"
  plan: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const Project = mongoose.model('Project', ProjectSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = { Project, Account };
