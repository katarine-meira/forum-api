import { User as PrismaUser } from '@prisma/client';

export class User implements PrismaUser {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  github: string | null;
  linkedin: string | null;
  skills: string | null;
  semester: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
