
Certainly! Below is a TypeScript implementation of the Mongoose models and schemas for your Easter Egg Adventure game based on the provided database schema.

```typescript
import mongoose, { Document, Schema } from 'mongoose';

// User Interface and Model
interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
}

const UserSchema: Schema<IUser> = new Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

const User = mongoose.model<IUser>('User', UserSchema);

// World Interface and Model
interface IWorld extends Document {
  worldId: string;
  worldName: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

const WorldSchema: Schema<IWorld> = new Schema({
  worldId: { type: String, required: true, unique: true },
  worldName: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const World = mongoose.model<IWorld>('World', WorldSchema);

// Egg Interface and Model
interface IEgg extends Document {
  eggId: string;
  worldId: string;
  placedBy: string;
  x: number;
  y: number;
  z: number;
  status: 'placed' | 'discovered' | 'claimed';
  placedAt: Date;
  discoveredAt?: Date;
  claimedAt?: Date;
  claimedBy?: string;
}

const EggSchema: Schema<IEgg> = new Schema({
  eggId: { type: String, required: true, unique: true },
  worldId: { type: String, required: true },
  placedBy: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'discovered', 'claimed'], default: 'placed' },
  placedAt: { type: Date, default: Date.now },
  discoveredAt: { type: Date },
  claimedAt: { type: Date },
  claimedBy: { type: String }
});

const Egg = mongoose.model<IEgg>('Egg', EggSchema);

// Portal Interface and Model
interface IPortal extends Document {
  portalId: string;
  sourceWorldId: string;
  destinationWorldId: string;
  x: number;
  y: number;
  z: number;
  createdBy: string;
}

const PortalSchema: Schema<IPortal> = new Schema({
  portalId: { type: String, required: true, unique: true },
  sourceWorldId: { type: String, required: true },
  destinationWorldId: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  createdBy: { type: String, required: true }
});

const Portal = mongoose.model<IPortal>('Portal', PortalSchema);

// Analytics Interface and Model
interface IAnalytics extends Document {
  actionId: string;
  userId: string;
  worldId: string;
  actionType: 'egg_placed' | 'egg_discovered' | 'egg_claimed' | 'portal_created' | 'world_created';
  targetId: string;
  timestamp: Date;
  details?: string;
}

const AnalyticsSchema: Schema<IAnalytics> = new Schema({
  actionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  worldId: { type: String, required: true },
  actionType: {
    type: String,
    enum: ['egg_placed', 'egg_discovered', 'egg_claimed', 'portal_created', 'world_created'],
    required: true
  },
  targetId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export { User, World, Egg, Portal, Analytics };
```

### Explanation:
1. **User Model**: Stores user information with fields for `userId`, `username`, `email`, and `passwordHash`.
2. **World Model**: Stores information about different 3D worlds with fields for `worldId`, `worldName`, `description`, `createdBy`, and `createdAt`.
3. **Egg Model**: Stores information about placed Easter eggs with fields for `eggId`, `worldId`, `placedBy`, coordinates (`x`, `y`, `z`), status, timestamps for placement, discovery, and claiming.
4. **Portal Model**: Stores information about portals between worlds with fields for `portalId`, source and destination world IDs, coordinates (`x`, `y`, `z`), and creator.
5. **Analytics Model**: Stores user actions for analytics with fields for `actionId`, `userId`, `worldId`, action type, target ID, timestamp, and optional details.

This code uses TypeScript interfaces to define the shape of each document and Mongoose schemas to enforce these structures in MongoDB. The models are exported for use throughout your application.