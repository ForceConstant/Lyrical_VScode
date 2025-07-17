# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2025-07-16

### Fixed
- Corrected an issue where the `syllable` function was not correctly imported, causing a runtime error.

## [0.0.3] - 2025-07-16

### Added
- Syllable counting is now disabled by default and only activates for files named `*.lyrical.md`.
- Added a new command `Lyrical: Toggle Syllable Count` to manually activate/deactivate syllable counting for any active file.