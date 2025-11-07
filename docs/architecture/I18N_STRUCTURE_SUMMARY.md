# i18n Structure: Shared vs Page-Specific ✅

## 📁 Final File Organization

### Shared Translations (Cross-app)
```
packages/i18n/src/locales/
├── en/
│   ├── common.json          # Buttons, labels, messages
│   ├── auth.json            # Login, signup (shared auth)
│   ├── validation.json      # Form validation messages
│   └── index.ts             # Export: { common, auth, validation }
├── ar/
│   ├── common.json
│   ├── auth.json
│   ├── validation.json
│   └── index.ts
└── es/
    ├── common.json
    ├── auth.json
    ├── validation.json
    └── index.ts
```

**What goes here:**
- ✅ Buttons (submit, cancel, save, delete)
- ✅ Labels (search, filter, sort)
- ✅ Messages (loading, error, success)
- ✅ Authentication (login/signup forms)
- ✅ Validation (email invalid, password too short)

---

### App/Page-Specific Translations
```
apps/{app}/messages/
├── en/
│   ├── dashboard.json       # Dashboard page only
│   ├── settings.json        # Settings page only
│   ├── profile.json         # Profile page only
│   └── index.ts             # Export: { dashboard, settings, profile }
├── ar/
│   ├── dashboard.json
│   ├── settings.json
│   ├── profile.json
│   └── index.ts
└── es/
    ├── dashboard.json
    ├── settings.json
    ├── profile.json
    └── index.ts
```

**What goes here:**
- ✅ Page-specific content (dashboard welcome, stats)
- ✅ Feature-specific terms (dashboard metrics, settings options)
- ✅ App-unique workflows

---

## 🎯 Namespace Convention

### Shared Translations
```typescript
// Format: namespace.category.key

// Common
common.buttons.submit
common.buttons.cancel
common.labels.search
common.messages.loading
common.validation.email.invalid

// Auth
auth.login.title
auth.login.submit
auth.signup.success
auth.user.created

// Validation
validation.email.invalid
validation.password.tooShort
```

### App/Page Translations
```typescript
// Format: page.section.key

// Dashboard
dashboard.title
dashboard.welcome
dashboard.stats.users
dashboard.stats.revenue

// Settings
settings.title
settings.profile.name
settings.notifications.email
```

---

## 💡 Decision Guide

### Should it be Shared?
Ask yourself:
1. **Will multiple apps use this?** → Shared
2. **Is it a common UI element?** (button, label) → Shared (`common.json`)
3. **Is it authentication related?** (login, signup) → Shared (`auth.json`)
4. **Is it validation?** (form errors) → Shared (`validation.json`)

### Should it be App/Page-Specific?
Ask yourself:
1. **Is it unique to one page?** → App-specific
2. **Does it describe app features?** (dashboard stats) → App-specific
3. **Would other apps NOT need this?** → App-specific

---

## 📝 Examples

### ✅ CORRECT Organization

```
# Shared - common.json
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}

# Shared - auth.json
{
  "login": {
    "title": "Sign In",
    "email": "Email"
  }
}

# App-specific - dashboard.json
{
  "title": "Dashboard",
  "stats": {
    "totalUsers": "Total users: {{count}}"
  }
}
```

### ❌ WRONG Organization

```
# ❌ Don't put dashboard content in shared
# packages/i18n/src/locales/en/common.json
{
  "dashboard": {
    "stats": { ... }  # This is page-specific!
  }
}

# ❌ Don't put common buttons in app-specific
# apps/web/messages/en/dashboard.json
{
  "buttons": {
    "submit": "Submit"  # This should be in shared!
  }
}
```

---

## 🔄 How It Works

### Backend
```typescript
// packages/i18n/src/index.ts exports shared
import en from './locales/en';  // { common, auth, validation }

// Use in services
i18n.t('common.validation.email.invalid', locale)
i18n.t('auth.login.success', locale)
```

### Frontend
```typescript
// apps/web/src/i18n.ts merges shared + app
{
  messages: {
    ...sharedTranslations,     // common, auth, validation
    ...appTranslations,         // dashboard, settings, profile
  }
}

// Use in components
const tCommon = useTranslations('common');
const tAuth = useTranslations('auth');
const tDashboard = useTranslations('dashboard');

tCommon('buttons.submit')
tAuth('login.title')
tDashboard('welcome', { name: 'John' })
```

---

## ✅ Quality Checklist

Before adding translations, verify:

### Shared Package (`packages/i18n/`)
- [ ] Is this used across multiple apps?
- [ ] Is it a common UI element?
- [ ] Does it belong in `common`, `auth`, or `validation` namespace?
- [ ] Have I added it to ALL locales (en, ar, es)?
- [ ] Have I exported it in `locales/{locale}/index.ts`?

### App Package (`apps/{app}/messages/`)
- [ ] Is this unique to this app/page?
- [ ] Have I organized by page (dashboard, settings, profile)?
- [ ] Have I added it to ALL locales (en, ar, es)?
- [ ] Have I exported it in `messages/{locale}/index.ts`?
- [ ] Did I avoid duplicating shared translations?

---

## 🎉 Benefits

### For Developers
- Clear where to add translations
- No guessing about shared vs app-specific
- Easy to find translations
- Type-safe with namespaces

### For Maintainers
- No duplication across apps
- Single source of truth for shared
- Easy to update shared translations
- Scalable for many apps

### For Users
- Consistent translations across apps
- No missing translations
- Full RTL support

---

**See I18N_INTEGRATION.md for complete implementation guide**
