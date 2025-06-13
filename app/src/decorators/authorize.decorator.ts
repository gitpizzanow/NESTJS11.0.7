import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { IsAuthorizedGuard } from 'src/guards/is-authorized/is-authorized.guard';
import { Roles } from 'src/guards/is-authorized/roles';

export class AuthorizeOptions {
  minimunRoleMode: boolean;
}

const defaultOptions: AuthorizeOptions = {
  minimunRoleMode: true,
};

export function Authorize(roles: Roles[], options: AuthorizeOptions = defaultOptions) {
  return applyDecorators(SetMetadata('roles', roles), SetMetadata('options', options), UseGuards(IsAuthorizedGuard));
}
