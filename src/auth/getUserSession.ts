'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "~/auth";

interface UserAndSession {
	username: string;
	userId: string;
	sessionId: string;
	expiresAt: Date;
	fresh: boolean;
}

export const getUserSession = cache(async (): Promise<UserAndSession | null> => {
	const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
	if (!sessionId) return null;
	const { user, session } = await auth.validateSession(sessionId);
	try {
		if (!user) {
			return null;
		} else if (session && session.fresh) {
			const sessionCookie = auth.createSessionCookie(session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		} else if (!session) {
			const sessionCookie = auth.createBlankSessionCookie();
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// Next.js throws error when attempting to set cookies when rendering page
		return null;
	}
	const { username } = user;
	const { expiresAt, fresh, id, userId } = session;
	return ({
		expiresAt,
		fresh,
		sessionId: id,
		userId,
		username
	});
});

export const getUserSessionAndRedirect = async (pageRoute: string = '/') => {
	const userSession = await getUserSession();
	if (userSession) redirect(pageRoute);
};