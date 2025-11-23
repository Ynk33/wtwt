import { Agent, run } from '@openai/agents';

import {
  ILLMService,
  LLMRecommendation,
  MovieFilters,
  UserMoviesWatched,
} from '@types';
import {
  LLM_AGENT_INSTRUCTIONS,
  LLM_BASE_PROMPT,
  LLM_FILTERS_PROMPT,
  LLM_OPENAI_MODEL,
} from '@config/llm.conf';

class LLMService implements ILLMService {
  private static instance: LLMService;
  private agent: Agent | null = null;

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  getAgent(): Agent {
    if (!this.agent) {
      this.agent = new Agent({
        name: 'Movie Recommendation Agent',
        instructions: LLM_AGENT_INSTRUCTIONS,
        model: LLM_OPENAI_MODEL,
      });
    }
    return this.agent;
  }

  /**
   * Call the LLM
   * @description Calls the LLM and returns the response
   * @param {string} prompt - The prompt to call the LLM with
   * @returns {Promise<string>} The response from the LLM
   */
  async call(prompt: string): Promise<string> {
    // TODO: improve usage of agent, making use of context and output type to reduce the size of the prompt
    const response = await run(this.getAgent(), prompt);
    return response.finalOutput || '';
  }

  /**
   * Generate recommendations
   * @description Generates recommendations for a user
   * @param {UserMoviesWatched[]} favoriteMovies - The favorite movies of the user
   * @param {MovieFilters} filters - The filters to apply to the recommendations
   * @param {number} filters.limit - The number of movies to return
   * @param {Array<string>} filters.genres - The genres of the movies to get
   * @param {Array<string>} filters.countries - The countries of the movies to get
   * @param {Object} filters.years - The years of the movies to get
   * @param {number} filters.years.min - The minimum year of the movies to get
   * @param {number} filters.years.max - The maximum year of the movies to get
   * @param {Object} filters.ratings - The ratings of the movies to get
   * @param {number} filters.ratings.min - The minimum rating of the movies to get
   * @param {number} filters.ratings.max - The maximum rating of the movies to get
   * @returns {Promise<LLMRecommendation[]>} The recommendations
   */
  async generateRecommendations(
    favoriteMovies: UserMoviesWatched[],
    filters?: MovieFilters
  ): Promise<LLMRecommendation[]> {
    // 1. Format movies with rich context for better recommendations
    const moviesText =
      favoriteMovies.length > 0
        ? favoriteMovies
            .map((movie, index) => {
              let movieEntry = `${index + 1}. "${movie.title}" (${movie.year})`;
              if (movie.rating !== undefined) {
                movieEntry += ` - Rating: ${movie.rating}/10`;
              }
              if (movie.review && movie.review.trim()) {
                movieEntry += `\n   Review: "${movie.review}"`;
              }
              return movieEntry;
            })
            .join('\n\n')
        : 'No movies watched yet';

    let prompt = LLM_BASE_PROMPT.replace('{{FAVORITE_MOVIES}}', moviesText);

    // 2. Format filters for better recommendations
    if (filters) {
      const filtersText = Object.entries(filters)
        .map(([key, value]) => {
          return this.formatFilter(key as keyof MovieFilters, value);
        })
        .join('\n');

      const filtersPrompt = LLM_FILTERS_PROMPT.replace(
        '{{FILTERS}}',
        filtersText
      );

      prompt = prompt.replace('{{FILTERS_PROMPT}}', filtersPrompt);
    } else {
      prompt = prompt.replace('{{FILTERS_PROMPT}}', '');
    }

    // 3. Call the LLM
    console.log('LLMService.generateRecommendations: calling openAI...', {
      prompt,
    });
    const response = await this.call(prompt);

    // 4. Parse the response - handle potential JSON parsing errors
    let recommendations: LLMRecommendation[];
    try {
      // Try to extract JSON if there's any surrounding text
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      recommendations = JSON.parse(jsonString) as LLMRecommendation[];
    } catch (error) {
      console.error(
        'LLMService.generateRecommendations: Failed to parse JSON response',
        {
          error,
          response,
        }
      );
      throw new Error(
        `Failed to parse LLM response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    console.log('LLMService.generateRecommendations: response received!', {
      count: recommendations.length,
      recommendations: recommendations.map((r) => r.title),
    });

    return recommendations;
  }

  /**
   * formatFilter
   * @description Format a filter in a format understandable by a LLM
   * @param {keyof MovieFilters} key The name of the filter
   * @param {Array<string> | { min?: number; max?: number }} value the value of the filter
   * @returns {string} The text for the LLM
   */
  formatFilter(
    key: keyof MovieFilters,
    value: Array<string> | { min?: number; max?: number }
  ): string {
    switch (key) {
      case 'genres': {
        const genres = value as Array<string>;
        return `The movie must meet all of the following genres: ${genres.join(', ')}`;
      }
      case 'countries': {
        const countries = value as Array<string>;
        return `The movie must be from at least one of the following countries: ${countries.join(', ')}`;
      }
      case 'years': {
        const years = value as { min?: number; max?: number };
        if (years.min && years.max) {
          return `The movie must be between ${years.min} and ${years.max} years old`;
        } else if (years.min && !years.max) {
          return `The movie must be from ${years.min} or later`;
        } else if (!years.min && years.max) {
          return `The movie must be from ${years.max} or earlier`;
        } else {
          console.error('LlmService.formatFilter: years filter is invalid', {
            key,
            value,
          });
          return '';
        }
      }
      case 'ratings': {
        const ratings = value as { min?: number; max?: number };
        if (ratings.min && ratings.max) {
          return `The movie must have a rating of at least ${ratings.min} and at most ${ratings.max}`;
        } else if (ratings.min && !ratings.max) {
          return `The movie must have a rating of at least ${ratings.min}`;
        } else if (!ratings.min && ratings.max) {
          return `The movie must have a rating of at most ${ratings.max}`;
        } else {
          console.error('LlmService.formatFilter: ratings filter is invalid', {
            key,
            value,
          });
          return '';
        }
      }
      default: {
        console.error('LlmService.formatFilter: filter key not found', { key });
        return '';
      }
    }
  }
}

export default LLMService.getInstance();
