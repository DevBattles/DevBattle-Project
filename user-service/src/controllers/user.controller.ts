import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { ok, created } from '../utils/response';
import { ApiError } from '../utils/error';
import { Messages } from '../constants/messages';
import { HttpStatus } from '../constants/httpStatus';
import { Role } from '../constants/roles';

/**
 * User controller — request/response only. All business logic lives in UserService.
 */
export const userController = {
  getMe: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.getMe(req.user!.id);
    ok(res, Messages.PROFILE_FETCHED, user);
  },

  updateMe: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.updateMe(req.user!.id, req.body);
    ok(res, Messages.PROFILE_UPDATED, user);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.getById(req.params.id);
    ok(res, Messages.USER_FETCHED, user);
  },

  list: async (req: Request, res: Response): Promise<void> => {
    const result = await userService.list(req.query as any);
    ok(res, Messages.USER_LISTED, result);
  },

  search: async (req: Request, res: Response): Promise<void> => {
    const result = await userService.search(req.query as any);
    ok(res, Messages.SEARCH_RESULTS, result);
  },

  statistics: async (_req: Request, res: Response): Promise<void> => {
    const stats = await userService.statistics();
    ok(res, Messages.STATISTICS_FETCHED, stats);
  },

  uploadAvatar: async (req: Request, res: Response): Promise<void> => {
    if (!req.file) throw ApiError.unprocessable(Messages.AVATAR_REQUIRED, [], 'AVATAR_REQUIRED');
    const user = await userService.uploadAvatar(req.user!.id, req.file as any);
    ok(res, Messages.AVATAR_UPLOADED, user);
  },

  deleteAvatar: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.deleteAvatar(req.user!.id);
    ok(res, Messages.AVATAR_DELETED, user);
  },

  changeStatus: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.changeStatus(req.params.id, req.body.isActive);
    ok(res, req.body.isActive ? Messages.USER_ACTIVATED : Messages.USER_BLOCKED, user);
  },

  changeRole: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.changeRole(req.params.id, req.body.role as Role);
    ok(res, Messages.ROLE_UPDATED, user);
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    await userService.deleteUser(req.params.id);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_DELETED });
  },

  /** Internal: called by the Auth Service when an account is created. */
  provision: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.provision(req.body);
    created(res, Messages.CREATED, user);
  },
};
