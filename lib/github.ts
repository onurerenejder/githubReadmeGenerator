import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
});

export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface FileTree {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
}

export interface RepoContents {
  fileTree: FileTree[];
  packageJson?: string;
  requirementsTxt?: string;
  readme?: string;
  description?: string;
  language?: string;
  topics?: string[];
}

export interface UserProfile {
  login: string;
  name?: string;
  bio?: string;
  avatar_url: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface UserRepository {
  name: string;
  description?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  html_url: string;
}

export interface UserProfileData {
  profile: UserProfile;
  repositories: UserRepository[];
  languages: Record<string, number>;
  topLanguages: string[];
}

/**
 * Parses GitHub profile URL and extracts username
 */
export function parseProfileUrl(url: string): string | null {
  try {
    // Remove protocol and trailing slashes
    const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    // Extract username from various URL formats
    const patterns = [
      /^github\.com\/([^\/]+)$/,
      /^github\.com\/([^\/]+)\/?$/,
      /^([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing profile URL:", error);
    return null;
  }
}

/**
 * Parses GitHub repository URL and extracts owner and repo name
 */
export function parseRepoUrl(url: string): RepoInfo | null {
  try {
    // Remove protocol and trailing slashes
    const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    // Extract owner/repo from various URL formats
    const patterns = [
      /^github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\.github\.io\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ""),
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing repo URL:", error);
    return null;
  }
}

/**
 * Fetches repository contents and metadata from GitHub API
 */
export async function fetchRepoContents(repoUrl: string): Promise<RepoContents | null> {
  try {
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
      throw new Error("Invalid repository URL");
    }

    const { owner, repo } = repoInfo;

    // Fetch repository metadata
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch root directory contents
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: "",
    });

    if (!Array.isArray(contents)) {
      throw new Error("Expected directory contents");
    }

    // Build file tree
    const fileTree: FileTree[] = contents.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      size: item.size,
    }));

    // Fetch package.json if it exists
    let packageJson: string | undefined;
    try {
      const pkgFile = contents.find((item: any) => item.name === "package.json");
      if (pkgFile && pkgFile.type === "file") {
        const { data: pkgData } = await octokit.repos.getContent({
          owner,
          repo,
          path: "package.json",
        });
        if ("content" in pkgData && pkgData.content) {
          packageJson = Buffer.from(pkgData.content, "base64").toString("utf-8");
        }
      }
    } catch (error) {
      // package.json not found, skip
    }

    // Fetch requirements.txt if it exists
    let requirementsTxt: string | undefined;
    try {
      const reqFile = contents.find((item: any) => item.name === "requirements.txt");
      if (reqFile && reqFile.type === "file") {
        const { data: reqData } = await octokit.repos.getContent({
          owner,
          repo,
          path: "requirements.txt",
        });
        if ("content" in reqData && reqData.content) {
          requirementsTxt = Buffer.from(reqData.content, "base64").toString("utf-8");
        }
      }
    } catch (error) {
      // requirements.txt not found, skip
    }

    // Fetch README if it exists
    let readme: string | undefined;
    try {
      const readmeFile = contents.find(
        (item: any) => item.name.toLowerCase().includes("readme")
      );
      if (readmeFile && readmeFile.type === "file") {
        const { data: readmeData } = await octokit.repos.getContent({
          owner,
          repo,
          path: readmeFile.path,
        });
        if ("content" in readmeData && readmeData.content) {
          readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
        }
      }
    } catch (error) {
      // README not found, skip
    }

    return {
      fileTree,
      packageJson,
      requirementsTxt,
      readme,
      description: repoData.description || undefined,
      language: repoData.language || undefined,
      topics: repoData.topics || [],
    };
  } catch (error) {
    console.error("Error fetching repo contents:", error);
    throw error;
  }
}

/**
 * Fetches GitHub user profile and repositories
 */
export async function fetchUserProfile(profileUrl: string): Promise<UserProfileData | null> {
  try {
    const username = parseProfileUrl(profileUrl);
    if (!username) {
      throw new Error("Invalid profile URL");
    }

    // Fetch user profile
    const { data: user } = await octokit.users.getByUsername({ username });

    // Fetch user repositories (sorted by stars, limit to 30)
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 30,
      type: "all",
    });

    // Calculate language statistics
    const languages: Record<string, number> = {};
    const userRepos: UserRepository[] = repos.map((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
      return {
        name: repo.name,
        description: repo.description || undefined,
        language: repo.language || undefined,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        html_url: repo.html_url,
      };
    });

    // Get top languages (sorted by frequency)
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([lang]) => lang);

    const profile: UserProfile = {
      login: user.login,
      name: user.name || undefined,
      bio: user.bio || undefined,
      avatar_url: user.avatar_url,
      location: user.location || undefined,
      company: user.company || undefined,
      blog: user.blog || undefined,
      twitter_username: user.twitter_username || undefined,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
    };

    return {
      profile,
      repositories: userRepos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10),
      languages,
      topLanguages,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
