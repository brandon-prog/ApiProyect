import { User } from '../../../entities/User'; // O usa 'src/entities/User' si tienes `baseUrl` configurado en tsconfig

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
